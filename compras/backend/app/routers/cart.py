from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.crud.cart import (
    list_cart_items,
    add_item_to_cart,
    update_item_quantity,
    clear_cart,
)
from app.schemas.carts import CartOut, CartItemUpdate, CartItemCreate  # ajusta nombres a los tuyos
from app.core.keycloak_security import require_auth, require_scope

router = APIRouter(
    prefix="/api/cart",
    tags=["Frontend - Carrito"],
)


@router.get(
    "",
    response_model=CartOut,
    dependencies=[Depends(require_scope("compras:read"))],
)
def get_cart(
    db: Session = Depends(get_db),
    token_data: dict = Depends(require_auth),
):
    user_id = token_data["sub"]
    cart = list_cart_items(db, user_id=user_id)
    return cart


@router.post(
    "/items",
    response_model=CartOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_scope("compras:write"))],
)
def add_item(
    payload: CartItemCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(require_auth),
):
    user_id = token_data["sub"]
    cart = add_item_to_cart(
        db,
        user_id=user_id,
        product_id=payload.product_id,
        quantity=payload.quantity,
    )
    return cart


@router.put(
    "/items/{product_id}",
    response_model=CartOut,
    dependencies=[Depends(require_scope("compras:write"))],
)
def update_item(
    product_id: int,
    payload: CartItemUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(require_auth),
):
    user_id = token_data["sub"]
    cart = update_item_quantity(
        db,
        user_id=user_id,
        product_id=product_id,
        quantity=payload.quantity,
    )
    return cart


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_scope("compras:write"))],
)
def empty_cart(
    db: Session = Depends(get_db),
    token_data: dict = Depends(require_auth),
):
    user_id = token_data["sub"]
    clear_cart(db, user_id=user_id)
    return
