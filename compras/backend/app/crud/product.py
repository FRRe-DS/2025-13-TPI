from typing import Sequence
from sqlalchemy.orm import Session
from sqlalchemy import select, asc, desc
from app.models.products import Product
from app.schemas.products import ProductCreate, ProductUpdate


def list_products(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    q: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    sort_by: str = "id",
    sort_dir: str = "asc"
)  -> Sequence[Product]:
    stmt = select(Product)

    if q:
        like = f"%{q}%"
        stmt = stmt.where((Product.name.ilike(like)) | (Product.description.ilike(like)))
    if min_price is not None:
        stmt = stmt.where(Product.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Product.price <= max_price)

    # orden 
    sort_col = {
        "id": Product.id,
        "name": Product.name,
        "price": Product.price,
        "sku": Product.sku,
        "stock": Product.stock,
        "category": Product.category
    }.get(sort_by, Product.id)
    stmt = stmt.order_by(asc(sort_col) if sort_dir == "asc" else desc(sort_col))

    stmt = stmt.offset(skip).limit(limit)
    return db.execute(stmt).scalars().all()

def get_product(db: Session, product_id: int) -> Product | None:
    return db.get(Product, product_id)

def get_product_by_sku(db: Session, sku: str) -> Product | None:
    if not sku:
        return None
    stmt = select(Product).where(Product.sku == sku)
    return db.execute(stmt).scalar_one_or_none()

def create_product(db: Session, data: ProductCreate) -> Product:
    if data.sku and get_product_by_sku(db, data.sku):
        raise ValueError("SKU ya existe")
    p = Product(**data.model_dump())
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

def update_product(db: Session, product_id: int, data: ProductUpdate) -> Product | None:
    p = get_product(db, product_id)
    if not p:
        return None
    payload = data.model_dump(exclude_unset=True)
    if "sku" in payload and payload["sku"]:
        existing = get_product_by_sku(db, payload["sku"])
        if existing and existing.id != product_id:
            raise ValueError("SKU ya existe")
    for k, v in payload.items():
        setattr(p, k, v)
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

def delete_product(db: Session, product_id: int) -> bool:
    p = get_product(db, product_id)
    if not p:
        return False
    db.delete(p)
    db.commit()
    return True



    