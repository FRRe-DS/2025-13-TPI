from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db import get_engine
from app.schemas.carts import CartItemCreate, CartItemUpdate, CartItemResponse
from app.crud import cart as cart_crud
from app.dependencies import get_current_user

router = APIRouter(prefix="/cart", tags=["Frontend - Carrito"])

@router.get("/me", response_model=CartItemResponse, status_code=status.HTTP_200_OK)
def get_my_cart(db: Session = Depends(get_engine), current_user=Depends(get_current_user)):
    return cart_crud.get_cart_view(db, current_user.id)

@router.post("/me/items", response_model=CartItemResponse, status_code=status.HTTP_200_OK)
def add_item_to_my_cart(payload: CartItemCreate, db: Session = Depends(get_engine), current_user=Depends(get_current_user)):
    cart_crud.add_item(db, current_user.id, payload)
    return cart_crud.get_cart_view(db, current_user.id)

@router.patch("/me/items/{product_id}", response_model=CartItemResponse, status_code=status.HTTP_200_OK)
def update_item_qty(product_id: int, payload: CartItemUpdate, db: Session = Depends(get_engine), current_user=Depends(get_current_user)):
    cart_crud.update_item(db, current_user.id, product_id, payload)
    return cart_crud.get_cart_view(db, current_user.id)

@router.delete("/me/items/{product_id}", response_model=CartItemResponse, status_code=status.HTTP_200_OK)
def remove_item_from_my_cart(product_id: int, db: Session = Depends(get_engine), current_user=Depends(get_current_user)):
    cart_crud.remove_item(db, current_user.id, product_id)
    return cart_crud.get_cart_view(db, current_user.id)

@router.delete("/me", response_model=CartItemResponse, status_code=status.HTTP_200_OK)
def clear_my_cart(db: Session = Depends(get_engine), current_user=Depends(get_current_user)):
    cart_crud.clear_cart(db, current_user.id)
    return cart_crud.get_cart_view(db, current_user.id)