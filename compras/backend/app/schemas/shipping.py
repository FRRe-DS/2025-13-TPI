from pydantic import BaseModel
from typing import List

class AddressIn(BaseModel):
    street: str
    city: str
    state: str
    postal_code: str
    country: str

class CheckoutShippingProduct(BaseModel):
    id: int
    quantity: int

class CheckoutWithShippingIn(BaseModel):
    delivery_address: AddressIn
    transport_type: str  # "air" | "road" | "rail" | "sea"