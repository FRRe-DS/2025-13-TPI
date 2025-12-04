# app/crud/shipping_client.py
import os
import httpx
from typing import List, Dict, Any
from fastapi import HTTPException

SHIPPING_API_URL = os.getenv("SHIPPING_API_URL", "http://shipping_back:3010")

# =============== SHIPPING COST ===============

async def cotizar_envio(payload: dict) -> dict:
    async with httpx.AsyncClient(base_url=SHIPPING_API_URL, timeout=10.0) as client:
        resp = await client.post("/shipping/cost", json=payload)

    try:
        resp.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Error al cotizar envío ({resp.text})",
        )

    return resp.json()

# =============== TRANSPORT METHODS ===============

def listar_metodos_transporte() -> Dict[str, Any]:

    with httpx.Client() as client:
        resp = client.get(
            f"{SHIPPING_API_URL}/shipping/transport-methods",
            timeout=10.0,
        )

    try:
        resp.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Error al obtener métodos de transporte ({resp.text})",
        )

    return resp.json()

# =============== CREATE SHIPPING ===============

def crear_envio(
    order_id: int,
    user_id: int | str,
    delivery_address: Dict[str, Any],
    transport_type: str,
    products: List[Dict[str, int]],
) -> Dict[str, Any]:
    payload = {
        "order_id": order_id,
        "user_id": int(user_id),
        "delivery_address": delivery_address,
        "transport_type": transport_type,
        "products": products,
    }

    with httpx.Client() as client:
        resp = client.post(
            f"{SHIPPING_API_URL}/shipping",
            json=payload,
            timeout=10.0,
        )

    try:
        resp.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Error al crear envío ({resp.text})",
        )

    return resp.json()