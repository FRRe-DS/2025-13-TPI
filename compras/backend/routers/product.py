from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_products():
    return [{"id": 1, "nombre": "Producto A"}, {"id": 2, "nombre": "Producto B"}]

@router.get("/{id}")
def get_product(id: int):
    return {"id": id, "nombre": f"Producto {id}"}
