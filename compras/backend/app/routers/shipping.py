# app/routers/shipping_clients.py
from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel

from app.core.keycloak_security import require_scope
from app.crud import shipping_client
from app.schemas.shipping import AddressIn

router = APIRouter(
    prefix="/api/shipping",
    tags=["Frontend - Shipping"],
)


class ShippingCostProductIn(BaseModel):
  id: int
  quantity: int


class ShippingCostIn(BaseModel):
  delivery_address: AddressIn
  products: List[ShippingCostProductIn]


@router.get(
    "/transport-methods",
    dependencies=[Depends(require_scope("compras:read"))],
)
def get_transport_methods():
    return shipping_client.listar_metodos_transporte()


@router.post(
    "/cost",
    dependencies=[Depends(require_scope("compras:read"))],
)
def get_shipping_cost(payload: ShippingCostIn):
    return shipping_client.cotizar_envio(
        delivery_address=payload.delivery_address.dict(),
        products=[p.model_dump() for p in payload.products],
    )


@router.get(
    "/{shipping_id}",
    dependencies=[Depends(require_scope("compras:read"))],
)
def get_shipping_detail(shipping_id: int):
    return shipping_client.obtener_envio(shipping_id)

