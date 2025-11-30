from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import jwt
from jwt import PyJWKClient

# En docker, Keycloak se ve por nombre de servicio.
# En tu máquina (PowerShell), el token viene con iss=localhost.
# Para DEV, desactivamos verify_iss y verify_aud.
ISSUER_PUBLIC = os.getenv(
    "KEYCLOAK_ISSUER_PUBLIC",
    "http://keycloak:8080/realms/ds-2025-realm"   # issuer que trae el token
)
JWKS_URL = os.getenv(
    "KEYCLOAK_JWKS_URL",
    "http://keycloak:8080/realms/ds-2025-realm/protocol/openid-connect/certs"  # desde docker
)

security = HTTPBearer()
jwks_client = PyJWKClient(JWKS_URL)


def decode_token(token: str) -> dict:
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={
                "verify_aud": False,
                "verify_iss": False,   # 👈 clave para que no choque localhost vs keycloak
            },
        )
        return payload

    except Exception as e:
        # si querés ver el error real en logs:
        # print("JWT ERROR:", repr(e))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )


def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    return decode_token(credentials.credentials)


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
