import os
from typing import Dict, Any

import jwt
from jwt import PyJWKClient
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# =========================
# Config
# =========================

# URL pública que Keycloak pone en el campo "iss" del token.
# Como levantás Keycloak con KC_HOSTNAME=localhost, el issuer real
# de los tokens es "http://localhost:8080/realms/ds-2025-realm".
KEYCLOAK_ISSUER = os.getenv(
    "KEYCLOAK_ISSUER",
    "http://localhost:8080/realms/ds-2025-realm",
)

# URL interna (desde Docker) para bajar las claves públicas (JWKS)
KEYCLOAK_JWKS_URL = os.getenv(
    "KEYCLOAK_JWKS_URL",
    "http://keycloak:8080/realms/ds-2025-realm/protocol/openid-connect/certs",
)

security = HTTPBearer()
jwks_client = PyJWKClient(KEYCLOAK_JWKS_URL)


# =========================
# Helpers
# =========================

def decode_token(token: str) -> Dict[str, Any]:
    """
    Decodifica y verifica el token de Keycloak usando RS256.
    - Verifica firma con la llave pública del JWKS.
    - No verifica aud.
    - Verifica issuer contra KEYCLOAK_ISSUER.
    """
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            issuer=KEYCLOAK_ISSUER,
            options={
                "verify_aud": False,
            },
        )
        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expirado",
        )
    except jwt.InvalidIssuerError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Issuer inválido en el token",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {e}",
        )


def require_auth(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Dict[str, Any]:
    """Dependencia principal para proteger endpoints."""
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Esquema de autenticación inválido",
        )

    return decode_token(credentials.credentials)


def require_scope(required_scope: str):
    """
    Devuelve una dependencia que chequea que el scope dado
    esté en el "scope" del token de Keycloak.
    """
    def dependency(payload: Dict[str, Any] = Depends(require_auth)):
        scopes_str = payload.get("scope", "")
        scopes = scopes_str.split()
        if required_scope not in scopes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Se requiere el scope '{required_scope}'",
            )
        return payload

    return dependency


def get_bearer_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Devuelve simplemente el string del access_token
    (para pasárselo a Logística en /api/shipping/...).
    """
    if credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Esquema de autenticación inválido",
        )
    return credentials.credentials
