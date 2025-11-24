# app/crud/carts.py
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status

from app.models.carts import Cart, CartItem
from app.models.products import Producto as Product
import os
import httpx

STOCK_API_URL = os.getenv("STOCK_API_URL", "http://stock:8000/v1")


async def get_product_from_stock(product_id: int) -> Product:
    async with httpx.AsyncClient() as client:
        # 👇 ajustá la ruta según el micro de stock
        resp = await client.get(f"{STOCK_API_URL}/products/{product_id}")
        resp.raise_for_status()
        data = resp.json()
        return Product(**data)

def get_or_create_cart(db: Session, user_id: str) -> Cart:
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items))
        .filter(Cart.user_id == user_id)
        .first()
    )
    if cart is None:
        cart = Cart(user_id=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    return cart


def list_cart_items(db: Session, user_id: str) -> Cart:
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items).joinedload(CartItem.product))
        .filter(Cart.user_id == user_id)
        .first()
    )
    if not cart:
        # devolver carrito vacío
        cart = Cart(user_id=user_id, items=[])
    return cart


def add_item_to_cart(db: Session, user_id: str, product_id: int, quantity: int) -> Cart:
    if quantity <= 0:
        raise HTTPException(status_code=400, detail="Cantidad debe ser mayor a cero")

    cart = get_or_create_cart(db, user_id=user_id)

    # Esto por ahora lee de tu BD local de productos
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # buscar si ya existe item para ese producto
    existing_item = None
    for item in cart.items:
        if item.product_id == product_id:
            existing_item = item
            break

    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity,
        )
        db.add(new_item)

    db.commit()
    db.refresh(cart)
    return cart


def update_item_quantity(db: Session, user_id: str, product_id: int, quantity: int) -> Cart:
    cart = get_or_create_cart(db, user_id=user_id)

    item = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id, CartItem.product_id == product_id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="Item no encontrado en el carrito")

    if quantity <= 0:
        db.delete(item)
    else:
        item.quantity = quantity

    db.commit()
    db.refresh(cart)
    return cart


def clear_cart(db: Session, user_id: str) -> None:
    cart = (
        db.query(Cart)
        .options(joinedload(Cart.items))
        .filter(Cart.user_id == user_id)
        .first()
    )
    if cart:
        for item in list(cart.items):
            db.delete(item)
        db.commit()
