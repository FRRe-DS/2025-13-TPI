from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.models.products import Product
from app.models.product_image import ProductImage
from app.schemas.images import ProductImageOut
import os, uuid

router = APIRouter(prefix="/api/product", tags=["product-images"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/{product_id}/images", response_model=ProductImageOut, status_code=status.HTTP_201_CREATED)
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    alt_text: str | None = Form(None),
    sort_order: int = Form(0),
    is_primary: bool = Form(False),
    db: Session = Depends(get_db),
):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Producto no encontrado")
    

    # Validacion simple de tipo de archivo 
    allowed = ["image/jpeg", "image/png", "image/webp"]
    if file.content_type not in allowed:
        raise HTTPException(415, f"Tipo no permitido: {file.content_type}")
    

    # Guardar archivo en .app/uploads/products/<id>/<uuid>.<ext>
    ext = os.path.splitext(file.filename)[1].lower() or ".jpg"
    fname = f"{uuid.uuid4().hex}{ext}"
    rel_dir = os.path.join("products", str(product_id))
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
    abs_dir = os.path.join(base_dir, rel_dir)
    os.makedirs(abs_dir, exist_ok=True)
    abs_path = os.path.join(abs_dir, fname)

    with open(abs_path, "wb") as f:
        f.write(await file.read())
    
    rel_url = f"/static/{rel_dir}/{fname}"  # publica URL

    img = ProductImage(
        product_id=product_id,
        url=rel_url,
        alt_text=alt_text,
        sort_order=sort_order,
        is_primary=is_primary,
    )
    db.add(img)

    db.commit()
    db.refresh(img)
    return img


@router.get("/{product_id}/images", response_model=list[ProductImageOut])
def list_product_images(product_id: int, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Producto no encontrado")
    return product.images


@router.delete("/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product_image(image_id: int, db: Session = Depends(get_db)):
    img = db.get(ProductImage, image_id)
    if not img:
        raise HTTPException(404, "Imagen no encontrada")
    
    # Eliminar archivo fisico
    db.delete(img)
    db.commit()
    return None