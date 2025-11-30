from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import os
import httpx

router = APIRouter(
    prefix="/api/auth",
    tags=["Auth"],
)


KEYCLOAK_BASE_URL = os.getenv("KEYCLOAK_BASE_URL", "http://keycloak:8080")
KEYCLOAK_REALM = os.getenv("KEYCLOAK_REALM", "ds-2025-realm")
CLIENT_ID = os.getenv("KEYCLOAK_CLIENT_ID", "grupo-13")
CLIENT_SECRET = os.getenv("KEYCLOAK_CLIENT_SECRET", "")

TOKEN_URL = f"{KEYCLOAK_BASE_URL}/realms/{KEYCLOAK_REALM}/protocol/openid-connect/token"


class CodeExchangeIn(BaseModel):
    code: str
    redirect_uri: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    expires_in: int | None = None
    refresh_token: str | None = None
    refresh_expires_in: int | None = None
    scope: str | None = None

@router.post("/exchange", response_model=TokenResponse)
async def exchange_code(body: CodeExchangeIn):
    """
    Intercambia el 'code' que recibe el frontend (tras login en Keycloak)
    por un access_token usando el cliente confidencial 'grupo-13'.
    """
    data = {
        "grant_type": "authorization_code",
        "code": body.code,
        "redirect_uri": body.redirect_uri,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(TOKEN_URL, data=data)

    # LOG PROVISORIO PARA VER QUÉ DICE KEYCLOAK
    print("TOKEN_URL:", TOKEN_URL)
    print("DATA ENVIADA:", data)
    print("KC RESP STATUS:", resp.status_code)
    print("KC RESP BODY:", resp.text)

    if resp.status_code != 200:
        detail = None
        try:
            detail = resp.json()
        except Exception:
            detail = resp.text

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"msg": "Error intercambiando code por token en Keycloak", "detail": detail},
        )

    return resp.json()