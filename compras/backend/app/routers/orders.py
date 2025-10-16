from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db
from app.routers.auth import get_current_user
from app.crud.order import checkout_from_cart, list_user_orders, get_user_order, cancel_user_order
from app.schemas.orders import OrderOut, OrderListItem

router = APIRouter(prefix="/api/cart", tags=["Frontend - Pedidos"], dependencies=[Depends(get_current_user)])

@router.post("/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def checkout(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    order = checkout_from_cart(db, user_id=current_user.id)
    return order


@router.get("/history", response_model=List[OrderListItem])
def history(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    orders = list_user_orders(db, user_id=current_user.id)
    return orders


@router.get("/history/{id}", response_model=OrderOut)
def get_order(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_user_order(db, uder_id=current_user.id, order_id=id)


@router.delete("/history/{id}", status_code=status.HTTP_204_NO_CONTENT)
def cancel_order(id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    cancel_user_order(db, user_id=current_user.id, order_id=id)
    return 


    