from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status
from decimal import Decimal

from app.models.orders import Order, OrderItem, OrderStatus
from app.models.carts import Cart, CartItem
from app.models.products import Product


def checkout_from_cart(db: Session, user_id: int) -> Order:
    # Traer carrito con items y productos
    cart: Cart | None = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.user_id == user_id)
        .first()
    )
    if not cart or len(cart.items) == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El carrito está vacío")
    
    # Validar stock y calcular total
    total = Decimal("0.00")
    for ci in cart.items:
        if ci.product.is_active is False: # si manejas baja logica
            raise HTTPException(status_code=409, detail=f"Producto inactivo: {ci.product.name}")
        if ci.quantity > ci.product.stock:
            raise HTTPException(
                status_code=409,
                detail=f"Stock insuficiente para {ci.product.name} (stock={ci.product.stock}, pedido={ci.quantity})",
            )
        total += Decimal(str(ci.product.price)) * ci.quantity

    # Crear orden + items y descontar stock en una transacción
    try:
        order = Order(user_id=user_id, status=OrderStatus.PENDING, total_amount=total)
        db.add(order)
        db.flush() # para obtener order.id

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
                raise HTTPException(status_code=409, detail=f"Stock negativo para {ci.product.name}")
            
        
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
        raise HTTPException(status_code=500, detail=f"Error en checkout:  {e}")
    

def list_user_orders(db: Session, user_id: int):
    return (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.user_id == user_id)
        .order_by(Order.created_at.desc())
        .all()
    )

def get_user_order(db: Session, uder_id: int, order_id: int) -> Order:
    order = (
        db.query(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id, Order.user_id == uder_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    return order

def cancel_user_order(db: Session, user_id: int, order_id: int) -> None:
    order = db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    
    if order.status not in (OrderStatus.PENDING,):
        raise HTTPException(status_code=409, detail=f"No se puede cancelar una orden en estado {order.status}")
    
    # Revertir stock y cancelar 
    try:
        items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        for it in items:
            prod = db.query(Product).filter(Product.id == it.product_id).with_for_update().first()
            if prod:
                prod.stock += it.quantity
        order.status = OrderStatus.CANCELED
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al cancelar la orden: {e}")