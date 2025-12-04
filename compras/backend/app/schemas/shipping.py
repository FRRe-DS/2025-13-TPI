from pydantic import BaseModel
from typing import List

class AddressIn(BaseModel):
    street: str
    city: str
    state: str
    postal_code: str
    country: str


# ============ SHIPPING COST (COTIZACIÓN) ============

class ShippingCostProductIn(BaseModel):
    id: int
    quantity: int


class ShippingCostRequest(BaseModel):
    """
    Request que se manda a /shipping/cost de Logística.
    Matchea con ShippingCostRequest del OpenAPI.
    """
    delivery_address: AddressIn
    products: List[ShippingCostProductIn]


class ShippingCostProductCost(BaseModel):
    id: int
    cost: float


class ShippingCostResponse(BaseModel):
    """
    Response que devuelve /shipping/cost.
    Matchea con ShippingCostResponse del OpenAPI.
    """
    currency: str
    total_cost: float
    transport_type: str
    products: List[ShippingCostProductCost]


# ============ CHECKOUT CON ENVÍO (CREAR ORDEN + ENVÍO) ============

class CheckoutShippingProduct(BaseModel):
    id: int
    quantity: int


class CheckoutWithShippingIn(BaseModel):
    delivery_address: AddressIn
    transport_type: str  # "air" | "road" | "rail" | "sea"