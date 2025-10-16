from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status 
from sqlalchemy.orm import Session
from app.schemas.products import ProductOut, ProductCreate, ProductUpdate
from app.crud.product import list_products, get_product, create_product, update_product, delete_product
from app.db import SessionLocal
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/product", tags=["Frontend - Productos"])

# Dependencia local (no usamos auth aún)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("", response_model=List[ProductOut])
def get_products(
    skip: int = 0,
    limit: int = Query(50, le=200),
    q: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort_by: str = Query("id", pattern="^(id|name|price|sku|stock|category)$"),
    sort_dir: str = Query("asc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    return list_products(db, skip, limit, q, min_price, max_price, sort_by, sort_dir)

@router.get("/{product_id}", response_model=ProductOut)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    p = get_product(db, product_id)
    if not p:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
    return p

@router.post("", dependencies=[Depends(get_current_user)], response_model=ProductOut, status_code=status.HTTP_201_CREATED)
def create_product_endpoint(data: ProductCreate, db: Session = Depends(get_db)):
    try:
        return create_product(db, data)
    except ValueError as e:
        # SKU duplicado
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))

@router.put("/{product_id}", response_model=ProductOut)
def update_product_endpoint(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    try:
        p = update_product(db, product_id, data)
        if not p:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        return p
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_endpoint(product_id: int, db: Session = Depends(get_db)):
    ok = delete_product(db, product_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return None


