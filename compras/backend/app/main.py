from fastapi import FastAPI
from routers import auth, product, shopcart, booking, tracking

app = FastAPI(title="Backend Compras", version="1.0")

# Incluir routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(product.router, prefix="/api/product", tags=["Product"])
app.include_router(shopcart.router, prefix="/api/shopcart", tags=["ShopCart"])
app.include_router(booking.router, prefix="/api/booking", tags=["Booking"])
app.include_router(tracking.router, prefix="/api/tracking", tags=["Tracking"])

@app.get("/")
def root():
    return {"message": "Backend Compras funcionando 🚀"}
