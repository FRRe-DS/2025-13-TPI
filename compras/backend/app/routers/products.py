from typing import List, Optional
from fastapi import APIRouter, Depends, Query

from app.models.products import Producto
from app.clients.stock_client import listar_productos, obtener_producto
from app.core.keycloak_security import require_auth, require_scope

router = APIRouter(
    prefix="/api/productos",
    tags=["Frontend - Productos"],
)


@router.get(
    "",
    response_model=List[Producto],
    dependencies=[Depends(require_scope("compras:read"))],
)
def list_products(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    q: Optional[str] = None,
    categoriaId: Optional[int] = None,
    token_data: dict = Depends(require_auth),
):
    # token_data["sub"] lo podrías usar si algún día stock pide usuarioId, etc.
    return listar_productos(page=page, limit=limit, q=q, categoria_id=categoriaId)


@router.get(
    "/{producto_id}",
    response_model=Producto,
    dependencies=[Depends(require_scope("compras:read"))],
)
def get_product(
    producto_id: int,
    token_data: dict = Depends(require_auth),
):
    return obtener_producto(producto_id)
