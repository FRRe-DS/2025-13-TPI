import os
import httpx
from fastapi import HTTPException

STOCK_API_URL = os.getenv("STOCK_API_URL", "http://stock-service:8000/v1")


def _map_stock_product_to_front(p: dict) -> dict:
    """Convierte el JSON de stock al formato que espera Producto + tu frontend"""
    # categoría: tomo el nombre de la primera categoría si existe
    category_name = None
    categorias = p.get("categorias") or []
    if categorias:
        category_name = categorias[0].get("nombre")

    # imagen principal
    imagenes = p.get("imagenes") or []
    main_image_url = None
    if imagenes:
        principal = next((img for img in imagenes if img.get("esPrincipal")), imagenes[0])
        main_image_url = principal.get("url")

    return {
        "id": p["id"],
        "name": p.get("nombre", ""),
        "description": p.get("descripcion", ""),
        "price": float(p.get("precio", 0) or 0),
        "sku": str(p["id"]),
        "category": category_name,
        "stock": p.get("stockDisponible", 0),
        "main_image_url": main_image_url,
        "images": [
            {
                "url": img.get("url", ""),
                "is_primary": img.get("esPrincipal", False),
            }
            for img in imagenes
        ],
    }


def listar_productos(page: int = 1, limit: int = 20, q: str | None = None, categoria_id: int | None = None):
    params: dict = {
        "page": page,
        "limit": limit,
    }
    if q:
        params["q"] = q
    if categoria_id:
        params["categoriaId"] = categoria_id

    try:
        r = httpx.get(f"{STOCK_API_URL}/productos", params=params, timeout=10.0)
        r.raise_for_status()
    except httpx.HTTPStatusError as e:
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Error al consultar stock: {e.response.text}",
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"No se pudo conectar al servicio de stock: {e}")

    data = r.json()

    # si el endpoint devuelve una lista simple:
    if isinstance(data, list):
        return [_map_stock_product_to_front(p) for p in data]

    # si devuelve algo del estilo {"items": [...]}
    items = data.get("items", [])
    return [_map_stock_product_to_front(p) for p in items]


def obtener_producto(producto_id: int):
    try:
        r = httpx.get(f"{STOCK_API_URL}/productos/{producto_id}", timeout=10.0)
        r.raise_for_status()
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        raise HTTPException(
            status_code=e.response.status_code,
            detail=f"Error al consultar stock: {e.response.text}",
        )
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"No se pudo conectar al servicio de stock: {e}")

    data = r.json()
    return _map_stock_product_to_front(data)
