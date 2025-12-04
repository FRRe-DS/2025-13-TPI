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
from app.crud.order import checkout_from_cart_with_shipping

from app.schemas.carts import CartOut, CartItemUpdate, CartItemCreate
from app.schemas.shipping import AddressIn
from app.schemas.orders import OrderOut

from app.core.keycloak_security import require_auth, require_scope, get_bearer_token
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/cart",
    tags=["Frontend - Carrito"],
)


# ====================
# GET CART
# ====================
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


# ====================
# ADD ITEM
# ====================
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


# ====================
# UPDATE ITEM
# ====================
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


# ====================
# CLEAR CART
# ====================
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


# ====================================================================
#  CHECKOUT (AQUÍ ES DONDE SE AGREGA EL ENVÍO A LOGÍSTICA)
# ====================================================================

# 1) Schema del body
class CartCheckoutIn(BaseModel):
    delivery_address: AddressIn
    transport_type: str


# 2) Endpoint /checkout
@router.post(
    "/checkout",
    response_model=OrderOut,
    dependencies=[Depends(require_scope("compras:write"))],
)
def checkout_cart(
    payload: CartCheckoutIn,
    db: Session = Depends(get_db),
    token_data: dict = Depends(require_auth),
):
    user_id = token_data["sub"]

    order = checkout_from_cart_with_shipping(
        db=db,
        user_id=user_id,
        delivery_address=payload.delivery_address,
        transport_type=payload.transport_type,
    )
    return order
