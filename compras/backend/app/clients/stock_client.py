import os
import httpx
from app.models.products import Producto

STOCK_API_URL = os.getenv("STOCK_API_URL", "http://stock-service:8000/v1")

async def listar_productos(page=1, limit=20, q=None, categoria_id=None):
    params = {
        "page": page,
        "limit": limit,
    }
    if q:
        params["q"] = q
    if categoria_id:
        params["categoriaId"] = categoria_id

    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{STOCK_API_URL}/products", params=params)
        resp.raise_for_status()
        data = resp.json()
        return [Producto(**item) for item in data]


async def obtener_producto(producto_id: int):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{STOCK_API_URL}/products/{producto_id}")
        resp.raise_for_status()
        return Producto(**resp.json())
