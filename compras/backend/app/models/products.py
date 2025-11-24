from pydantic import BaseModel, HttpUrl
from typing import List, Optional


class Categoria(BaseModel):
  id: int
  nombre: str
  descripcion: Optional[str] = None


class ImagenProducto(BaseModel):
  url: HttpUrl
  esPrincipal: bool


class Producto(BaseModel):
  id: int
  nombre: str
  descripcion: Optional[str] = None
  precio: float
  stockDisponible: int
  pesoKg: Optional[float] = None
  categorias: Optional[List[Categoria]] = None
  imagenes: Optional[List[ImagenProducto]] = None
