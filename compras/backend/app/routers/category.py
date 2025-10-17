from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.schemas.category import CategoryOut, CategoryCreate
from app.crud.category import create_category, list_categories

router = APIRouter(prefix="/api/category", tags=["category"])


@router.get("", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return list_categories(db)


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_new_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    return create_category(db, payload)