from sqlalchemy.orm import Session 
from fastapi import HTTPException, status
from decimal import Decimal, ROUND_HALF_UP
from app.models.carts import Cart, CartItem
from app.models.products import Product
from app.schemas.carts import CartItemCreate, CartItemUpdate


def _money(v: Decimal) -> Decimal:
    return v.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def get_or_create_cart(db: Session, user_id: int) -> Cart:
    cart = db.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart

def add_item(db: Session, user_id: int, payload: CartItemCreate) -> Cart:
    cart = get_or_create_cart(db, user_id)


    product = db.query(Product).filter(Product.id == payload.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # validar stock si corresponde (opcional)
    # if product.stock < payload.quantity: ...

    item = (db.query(CartItem)
            .filter(CartItem.cart_id == cart.id, CartItem.product_id == product.id)
            .first())
    

    if item:
        item.quantity += payload.quantity
    else:
        item = CartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=payload.quantity,
            unit_price=_money(Decimal(str(product.price)))
        )
        db.add(item)

    db.commit()
    db.refresh(cart)
    return cart

def update_item(db: Session, user_id: int, product_id: int, payload: CartItemUpdate) -> Cart:
    cart = get_or_create_cart(db, user_id)
    item = (db.query(CartItem)
            .filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
            .first())
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    item.quantity = payload.quantity
    db.commit()
    db.refresh(cart)
    return cart

def remove_item(db: Session, user_id: int, product_id: int) -> Cart:
    cart = get_or_create_cart(db, user_id)
    item = (db.query(CartItem)
            .filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
            .first())
    if not item:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    db.delete(item)
    db.commit()
    db.refresh(cart)
    return cart

def clear_cart(db: Session, user_id: int) -> Cart:
    cart = get_or_create_cart(db, user_id)
    db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
    db.commit()
    db.refresh(cart)
    return cart

def get_cart_view(db: Session, user_id: int):
    """Devuelve el cart con items “enriquecidos” + totales para el schema de respuesta."""
    cart = get_or_create_cart(db, user_id)
    items_resp = []
    total_items = 0
    subtotal = Decimal("0.00")

    for it in cart.items:
        name = it.product.name if it.product else "Unknown"
        line_total = _money(Decimal(it.quantity) * Decimal(it.unit_price))
        items_resp.append({
            "product_id": it.product_id,
            "name": name,
            "quantity": it.quantity,
            "unit_price": _money(Decimal(it.unit_price)),
            "line_total": line_total
        })
        total_items += it.quantity
        subtotal += line_total

    return {
        "items": items_resp,
        "total_items": total_items,
        "subtotal": _money(subtotal)
    }

            
