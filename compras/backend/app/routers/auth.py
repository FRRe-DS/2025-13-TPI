from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
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


router = APIRouter(prefix="/api/auth", tags=["auth"])

class CodeExchangeIn(BaseModel):
  code: str
  redirect_uri: str


class LoginIn(BaseModel):
  # en el front lo llamamos "email", acá lo usamos como username para Keycloak
  email: str
  password: str


class RegisterPayload(BaseModel):
  first_name: str
  last_name: str
  email: EmailStr
  password: str

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

  # LOG PROVISORIO
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
          detail={
              "msg": "Error intercambiando code por token en Keycloak",
              "detail": detail,
          },
      )

  return resp.json()


@router.post("/login", response_model=TokenResponse)
async def login_with_credentials(body: LoginIn):
  """
  Login directo con usuario/contraseña.

  El frontend manda email y password, y acá llamamos a Keycloak
  usando el flujo 'password' (Direct Access Grants).
  """
  data = {
      "grant_type": "password",
      "client_id": CLIENT_ID,
      "client_secret": CLIENT_SECRET,
      "username": body.email,   # si querés usar username puro, cambiá esto
      "password": body.password,
  }

  async with httpx.AsyncClient() as client:
      resp = await client.post(TOKEN_URL, data=data)

  print("LOGIN KC RESP STATUS:", resp.status_code)
  print("LOGIN KC RESP BODY:", resp.text)

  if resp.status_code != 200:
      detail = None
      try:
          detail = resp.json()
      except Exception:
          detail = resp.text

      raise HTTPException(
          status_code=status.HTTP_401_UNAUTHORIZED,
          detail={
              "msg": "Credenciales inválidas o error en Keycloak",
              "detail": detail,
          },
      )

  return resp.json()

async def get_keycloak_admin_token() -> str:
    """
    Obtiene un access_token de administrador para usar la Admin API de Keycloak.
    Podés hacerlo con:
    - usuario/contraseña admin, o
    - client credentials de un cliente confidencial con 'service account'.
    Aquí te muestro con cliente confidencial (recomendado para backend).
    """
    keycloak_base = os.getenv("KEYCLOAK_BASE_URL", "http://keycloak:8080")
    realm = os.getenv("KEYCLOAK_ADMIN_REALM", "master")
    client_id = os.getenv("KEYCLOAK_ADMIN_CLIENT_ID")
    client_secret = os.getenv("KEYCLOAK_ADMIN_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise HTTPException(
            status_code=500,
            detail="Faltan KEYCLOAK_ADMIN_CLIENT_ID o KEYCLOAK_ADMIN_CLIENT_SECRET",
        )

    token_url = f"{keycloak_base}/realms/{realm}/protocol/openid-connect/token"

    data = {
        "grant_type": "client_credentials",
        "client_id": client_id,
        "client_secret": client_secret,
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            token_url,
            data=data,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )

    if resp.status_code != 200:
        print("Error obteniendo admin token:", resp.status_code, resp.text)
        raise HTTPException(status_code=500, detail="No se pudo obtener token de admin")

    token_data = resp.json()
    return token_data["access_token"]

@router.post("/register", status_code=201)
async def register_user(payload: RegisterPayload):
    keycloak_base = os.getenv("KEYCLOAK_BASE_URL", "http://keycloak:8080")
    realm = os.getenv("KEYCLOAK_REALM", "tpi")

    admin_token = await get_keycloak_admin_token()

    create_user_url = f"{keycloak_base}/admin/realms/{realm}/users"

    user_body = {
        "username": payload.email,
        "email": payload.email,
        "firstName": payload.first_name,
        "lastName": payload.last_name,
        "enabled": True,
        "emailVerified": False,
        "credentials": [
            {
                "type": "password",
                "value": payload.password,
                "temporary": False,
            }
        ],
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            create_user_url,
            json=user_body,
            headers={
                "Authorization": f"Bearer {admin_token}",
                "Content-Type": "application/json",
            },
        )

    if resp.status_code == 201:
        # Usuario creado OK
        return {"message": "Usuario creado en Keycloak"}

    if resp.status_code == 409:
        # Conflicto: probablemente ya existe el email/username
        raise HTTPException(
            status_code=409,
            detail="Ya existe un usuario con ese correo.",
        )

    print("Error creando usuario en Keycloak:", resp.status_code, resp.text)
    raise HTTPException(
        status_code=500,
        detail=f"Error al crear usuario en Keycloak ({resp.status_code})",
    )
