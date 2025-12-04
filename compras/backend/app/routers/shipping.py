# app/routers/shipping_clients.py
from fastapi import APIRouter, Depends
from typing import List
from pydantic import BaseModel

from app.core.keycloak_security import get_bearer_token, require_scope
from app.crud import shipping_client
from app.schemas.shipping import AddressIn, ShippingCostRequest, ShippingCostResponse

router = APIRouter(
    prefix="/api/shipping",
    tags=["Frontend - Shipping"],
)



# ================= TRANSPORT METHODS =================

@router.get(
    "/transport-methods",
    dependencies=[Depends(require_scope("compras:read"))],
)
def get_transport_methods(
    _: str = Depends(get_bearer_token),  # opcional: solo para obligar a estar logueado
):
    return shipping_client.listar_metodos_transporte()



# ================= SHIPPING COST =================

@router.post(
    "/cost",
    response_model=ShippingCostResponse,
    dependencies=[Depends(require_scope("compras:read"))],
)
async def get_shipping_cost(
    payload: ShippingCostRequest,
    _: str = Depends(get_bearer_token),  # sólo obliga a que el usuario esté logueado
):
    body = payload.model_dump()
    return await shipping_client.cotizar_envio(body)

