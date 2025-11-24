#Cliente para Stock (reservas)

import os, httpx
from typing import List

STOCK_BASE_URL = os.getenv("STOCK_BASE_URL", "http://localhost:8001/v1")

async def crear_reserva_stock(
    bearer_token: str,
    usuario_id: int,
    id_compra: str,
    productos: List[dict],  # [{idProducto, cantidad}]
):
    url = f"{STOCK_BASE_URL}/reservas"
    headers = {"Authorization": f"Bearer {bearer_token}"}

    body = {
        "idCompra": id_compra,
        "usuarioId": usuario_id,
        "productos": productos
    }

    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(url, json=body, headers=headers)
        r.raise_for_status()
        return r.json()

#Enviar a Stock al hacer checkout
#En tu endpoint de checkout (routers/orders.py o donde estés creando la orden):
#asegurar usuario interno (User)
#crear orden local
#notificar Stock con usuarioId entero y productos
#guardar idReserva si querés persistirlo