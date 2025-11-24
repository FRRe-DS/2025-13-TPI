import os
import httpx
from typing import List, Optional
from fastapi import HTTPException

from app.models.products import Producto

STOCK_API_URL = os.getenv("STOCK_API_URL", "http://stock:8000/v1")
KEYCLOAK_TOKEN_URL = os.getenv("KEYCLOAK_TOKEN_URL")
KEYCLOAK_CLIENT_ID = os.getenv("grupo-13")
KEYCLOAK_CLIENT_SECRET = os.getenv("404249de-18ba-403c-b45c-d82c446e2a2a")


def _get_stock_access_token() -> str:
    """
    Saca un token de Keycloak con client_credentials para llamar a STOCK.
    El client en Keycloak tiene que tener scopes tipo productos:read.
    """
    if not KEYCLOAK_TOKEN_URL:
        raise RuntimeError("KEYCLOAK_TOKEN_URL no configurado")

    data = {
        "grant_type": "client_credentials",
        "client_id": KEYCLOAK_CLIENT_ID,
        "client_secret": KEYCLOAK_CLIENT_SECRET,
    }

    with httpx.Client() as client:
        resp = client.post(KEYCLOAK_TOKEN_URL, data=data)
        if resp.status_code != 200:
            raise HTTPException(
                status_code=502,
                detail="No se pudo obtener token para STOCK",
            )
        token_data = resp.json()
        return token_data["access_token"]


def listar_productos(
    page: int = 1,
    limit: int = 20,
    q: Optional[str] = None,
    categoria_id: Optional[int] = None,
) -> List[Producto]:
    token = _get_stock_access_token()

    params = {"page": page, "limit": limit}
    if q:
        params["q"] = q
    if categoria_id is not None:
        params["categoriaId"] = categoria_id

    with httpx.Client() as client:
        resp = client.get(
            f"{STOCK_API_URL}/productos",
            headers={"Authorization": f"Bearer {token}"},
            params=params,
        )

    if resp.status_code == 404:
        return []

    try:
        resp.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=502,
            detail="Error al consultar productos en STOCK",
        )

    data = resp.json()
    return [Producto(**p) for p in data]


def obtener_producto(producto_id: int) -> Producto:
    token = _get_stock_access_token()

    with httpx.Client() as client:
        resp = client.get(
            f"{STOCK_API_URL}/productos/{producto_id}",
            headers={"Authorization": f"Bearer {token}"},
        )

    if resp.status_code == 404:
        raise HTTPException(status_code=404, detail="Producto no encontrado en STOCK")

    try:
        resp.raise_for_status()
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=502,
            detail="Error al consultar producto en STOCK",
        )

    data = resp.json()
    return Producto(**data)
