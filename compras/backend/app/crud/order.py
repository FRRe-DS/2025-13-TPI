from sqlalchemy.orm import Session, joinedload 
from fastapi import HTTPException, status
from decimal import Decimal

from app.models.orders import Order, OrderItem, OrderStatus
from app.models.carts import Cart, CartItem
from app.models.products import Producto as Product
from app.crud import shipping_client
from app.schemas.shipping import AddressIn
from app.core.keycloak_security import get_bearer_token



def checkout_from_cart(db: Session, user_id: str) -> Order:
    # Traer carrito con items y productos
    cart: Cart | None = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.user_id == user_id)
        .first()
    )
    if not cart or len(cart.items) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El carrito está vacío"
        )
    
    # Validar stock y calcular total
    total = Decimal("0.00")
    for ci in cart.items:
        if ci.product.is_active is False:  # si manejas baja lógica
            raise HTTPException(
                status_code=409,
                detail=f"Producto inactivo: {ci.product.name}"
            )
        if ci.quantity > ci.product.stock:
            raise HTTPException(
                status_code=409,
                detail=(
                    f"Stock insuficiente para {ci.product.name} "
                    f"(stock={ci.product.stock}, pedido={ci.quantity})"
                ),
            )
        total += Decimal(str(ci.product.price)) * ci.quantity

    # Crear orden + items y descontar stock en una transacción
    try:
        order = Order(user_id=user_id, status=OrderStatus.PENDING, total_amount=total)
        db.add(order)
        db.flush()  # para obtener order.id

        for ci in cart.items:
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=ci.product_id,
                    product_name=ci.product.name,
                    unit_price=ci.product.price,
                    quantity=ci.quantity,
                )
            )
            # descontar stock
            ci.product.stock -= ci.quantity
            if ci.product.stock < 0:
                raise HTTPException(
                    status_code=409,
                    detail=f"Stock negativo para {ci.product.name}"
                )
        
        # Vaciar carrito
        for ci in list(cart.items): 
            db.delete(ci)
        
        db.commit()
        db.refresh(order)
        return order
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error en checkout: {e}"
        )

def checkout_from_cart_with_shipping(
    db: Session,
    user_id: str,
    delivery_address: AddressIn,
    transport_type: str,
) -> Order:
    order = checkout_from_cart(db, user_id)

    products_for_shipping: list[dict] = []
    for item in order.items:
        if not hasattr(item, "product_id"):
            raise HTTPException(
                status_code=500,
                detail="OrderItem no tiene product_id definido. Revisar modelo OrderItem.",
            )
        products_for_shipping.append(
            {"id": item.product_id, "quantity": item.quantity}
        )

    shipping_resp = shipping_client.crear_envio(
        order_id=order.id,
        user_id=user_id,
        delivery_address=delivery_address.dict(),
        transport_type=transport_type,
        products=products_for_shipping,
    )

    order.shipping_id = shipping_resp.get("shipping_id")
    order.shipping_status = shipping_resp.get("status")
    order.shipping_transport_type = shipping_resp.get("transport_type")

    db.commit()
    db.refresh(order)
    return order

def list_user_orders(db: Session, user_id: str):
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )


def get_user_order(db: Session, user_id: str, order_id: int) -> Order:
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id, Order.user_id == user_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return order


def cancel_user_order(db: Session, user_id: str, order_id: int) -> None:
    order: Order | None = (
        db.query(Order)
        .filter(Order.id == order_id, Order.user_id == user_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    if order.shipping_id:
        shipping_client.cancelar_envio(order.shipping_id)

    order.status = OrderStatus.CANCELED
    order.shipping_status = "cancelled"
    db.commit()
    
    if order.status != OrderStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail="Solo se pueden cancelar órdenes en estado PENDING",
        )
    
    # Revertir stock y cancelar 
    try:
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        for it in items:
            prod = (
                db.query(Product)
                .filter(Product.id == it.product_id)
                .with_for_update()
                .first()
            )
            if prod:
                prod.stock += it.quantity
        order.status = OrderStatus.CANCELED
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al cancelar la orden: {e}"
        )
