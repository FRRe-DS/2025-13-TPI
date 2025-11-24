from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient

ISSUER = "http://localhost:8080/realms/ds-2025-realm"
JWKS_URL = f"{ISSUER}/protocol/openid-connect/certs"

security = HTTPBearer()
jwks_client = PyJWKClient(JWKS_URL)


def decode_token(token: str) -> dict:
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False},
            issuer=ISSUER,
        )
        return payload
    except Exception as e:
        print("Error decodificando token:", e)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )


def require_auth(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization debe ser 'Bearer <token>'",
        )
    token = credentials.credentials
    return decode_token(token)


def require_scope(required_scope: str):
    
    def dependency(payload: dict = Depends(require_auth)):
        scopes_str = payload.get("scope", "")
        scopes = scopes_str.split()
        if required_scope not in scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Se requiere el scope '{required_scope}'",
            )
        return payload
    return dependency
