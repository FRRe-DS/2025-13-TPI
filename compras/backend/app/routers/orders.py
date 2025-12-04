from app.crud import shipping_client
from app.models.orders import Order
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.crud.order import (
    checkout_from_cart,
    checkout_from_cart_with_shipping,
    list_user_orders,
    get_user_order,
    cancel_user_order,
)
from app.schemas.orders import OrderOut, OrderListItem
from app.schemas.shipping import CheckoutWithShippingIn
from app.core.keycloak_security import require_auth, require_scope
from app.schemas.shipping import AddressIn

router = APIRouter(
    prefix="/api/cart",
    tags=["Frontend - Pedidos"],
)


def checkout_from_cart_with_shipping(
    db: Session,
    user_id: str,
    delivery_address: AddressIn,
    transport_type: str,
) -> Order:
    order = checkout_from_cart(db, user_id)

    products_for_shipping: list[dict] = [
        {"id": item.product_id, "quantity": item.quantity}
        for item in order.items
    ]

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



@router.get(
    "/history",
    response_model=List[OrderListItem],
    dependencies=[Depends(require_scope("compras:read"))],
)
def history(
    db: Session = Depends(get_db),
    token_data: dict = Depends(require_auth),
):
    user_id = token_data["sub"]
    orders = list_user_orders(db, user_id=user_id)
    return orders


@router.get(
    "/history/{id}",
    response_model=OrderOut,
    dependencies=[Depends(require_scope("compras:read"))],
)
def get_order(
    id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(require_auth),
):
    user_id = token_data["sub"]
    return get_user_order(db, user_id=user_id, order_id=id)


@router.delete(
    "/history/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_scope("compras:write"))],
)
def cancel_order(
    id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(require_auth),
):
    user_id = token_data["sub"]
    cancel_user_order(db, user_id=user_id, order_id=id)
    return


    