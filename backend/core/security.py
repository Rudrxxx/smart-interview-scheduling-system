import os
import httpx
from jose import jwt, JWTError
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")

class ClerkJWTVerifier:
    def __init__(self):
        self.jwks = None

    def get_jwks(self):
        if not self.jwks:
            if not CLERK_JWKS_URL:
                raise ValueError("CLERK_JWKS_URL is not configured in environment variables.")
            response = httpx.get(CLERK_JWKS_URL)
            response.raise_for_status()
            self.jwks = response.json()
        return self.jwks

    def verify_token(self, token: str):
        try:
            jwks = self.get_jwks()
            unverified_header = jwt.get_unverified_header(token)
            
            rsa_key = {}
            for key in jwks.get("keys", []):
                if key["kid"] == unverified_header.get("kid"):
                    rsa_key = {
                        "kty": key["kty"],
                        "kid": key["kid"],
                        "use": key["use"],
                        "n": key["n"],
                        "e": key["e"]
                    }
            
            if not rsa_key:
                raise HTTPException(status_code=401, detail="Unable to find appropriate JWKS key.")
                
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                options={"verify_aud": False, "verify_iss": False}
            )
            return payload
            
        except JWTError as e:
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
        except Exception as e:
            raise HTTPException(status_code=401, detail=str(e))

verifier = ClerkJWTVerifier()

def decode_clerk_token(token: str):
    return verifier.verify_token(token)
