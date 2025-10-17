from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

def list_categories(db: Session):
    return db.query(Category).all()

def create_category(db: Session, payload: CategoryCreate):
    new_category = Category(
        name=payload.name,
        description=payload.description
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

def update_category(db: Session, category_id: int, payload: CategoryUpdate):
    cat = db.query(Category).get(category_id)
    if not cat:
        return None
    if payload.name is not None:
        cat.name = payload.name
    if payload.description is not None:
        cat.description = payload.description
    if payload.image_url is not None:
        cat.image_url = payload.image_url
    db.commit()
    db.refresh(cat)
    return cat