from sqlalchemy.orm import Session
from app.models.category import Category
from app.schemas.category import CategoryCreate

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