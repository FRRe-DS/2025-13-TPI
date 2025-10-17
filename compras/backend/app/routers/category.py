import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.schemas.category import CategoryOut, CategoryCreate, CategoryUpdate
from app.crud.category import create_category, list_categories, update_category
from app.models.category import Category

router = APIRouter(prefix="/api/category", tags=["category"])

# --- helpers ---
ALLOWED_IMAGE_MIME = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}

def _ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)

def _ext_from_mime(content_type: str) -> str:
    return ALLOWED_IMAGE_MIME.get(content_type, "")


@router.get("", response_model=List[CategoryOut])
def get_categories(db: Session = Depends(get_db)):
    return list_categories(db)


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_new_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    return create_category(db, payload)

@router.patch("/{category_id}", response_model=CategoryOut)
def patch_category(category_id: int, payload: CategoryUpdate, db: Session = Depends(get_db)):
    cat = update_category(db, category_id, payload)
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return cat

@router.post("/{category_id}/image", response_model=CategoryOut, status_code=status.HTTP_200_OK)
async def upload_category_image(
    category_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    
    # 1) Validar categoría
    cat = db.query(Category).get(category_id)
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    
    # 2) Validar archivo
    ext = _ext_from_mime(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid image format")
    
    # 3) Cortar por tamaño máximo (5MB)
    data = await file.read()
    MAX_MB = 5
    if len(data) > MAX_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail=f"El archivo excede {MAX_MB} MB")
    
    # 4) Guardar en /uploads/categories/{id}/<uuid>.<ext>
    # main.py ya monta /static sobre app/uploads
    base_dir = os.path.join(os.path.dirname(__file__), "..", "uploads")
    base_dir = os.path.abspath(base_dir)
    save_dir = os.path.join(base_dir, "categories", str(category_id))
    _ensure_dir(save_dir)

    fname = f"{uuid.uuid4().hex}{ext}"
    fpath = os.path.join(save_dir, fname)
    with open(fpath, "wb") as f:
        f.write(data)
    
    # 5) setear ruta relativa que sirve StaticFiles
    # importante: usar ruta bajo /static
    rel_url = f"/static/categories/{category_id}/{fname}"
    cat.image_url = rel_url
    db.commit()
    db.refresh(cat)
    return cat
