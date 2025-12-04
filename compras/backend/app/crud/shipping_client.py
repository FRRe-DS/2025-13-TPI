# app/crud/shipping_client.py
import os
import httpx
from typing import List, Dict, Any
from fastapi import HTTPException

SHIPPING_API_URL = os.getenv("SHIPPING_API_URL", "http://shipping_back:3010")


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


# =============== SHIPPING COST (QUOTE) ===============

def cotizar_envio(
    delivery_address: Dict[str, Any],
    products: List[Dict[str, int]],
) -> Dict[str, Any]:
    payload = {
        "delivery_address": delivery_address,
        "products": products,
    }

    with httpx.Client() as client:
        resp = client.post(
            f"{SHIPPING_API_URL}/shipping/cost",
            json=payload,
            timeout=10.0,
        )

    try:
        resp.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Error al cotizar envío ({resp.text})",
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


# =============== DETALLE + CANCELACIÓN ===============

def obtener_envio(shipping_id: int) -> Dict[str, Any]:
    with httpx.Client() as client:
        resp = client.get(
            f"{SHIPPING_API_URL}/shipping/{shipping_id}",
            timeout=10.0,
        )

    if resp.status_code == 404:
        raise HTTPException(status_code=404, detail="Envío no encontrado en Logística")

    try:
        resp.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Error al obtener envío ({resp.text})",
        )

    return resp.json()


def cancelar_envio(shipping_id: int) -> Dict[str, Any]:
    with httpx.Client() as client:
        resp = client.post(
            f"{SHIPPING_API_URL}/shipping/{shipping_id}/cancel",
            timeout=10.0,
        )

    if resp.status_code == 404:
        raise HTTPException(status_code=404, detail="Envío no encontrado en Logística")

    try:
        resp.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=resp.status_code,
            detail=f"Error al cancelar envío ({resp.text})",
        )

    return resp.json()

