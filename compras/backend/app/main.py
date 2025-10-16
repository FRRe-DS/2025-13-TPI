from fastapi import FastAPI
from app.db import engine, Base
from app.models import products as product_model  # Asegura que el modelo se registre
from app.models import carts as cart_item_model
from app.models import order_item as order_item_model
from app.routers import product as product_router
from app.routers import auth, cart
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings

app = FastAPI(title="Backend Compras", version="1.0")

# (dev) crear tablas si aún no usás Alembic
Base.metadata.create_all(bind=engine)

# Incluir routers
#app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(product_router.router)
app.include_router(auth.router)
app.include_router(cart.router)
#app.include_router(booking.router, prefix="/api/booking", tags=["Booking"])
#app.include_router(tracking.router, prefix="/api/tracking", tags=["Tracking"])


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/")
def root():
    return {"message": "Backend Compras funcionando 🚀"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
