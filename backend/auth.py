import os
import time
import uuid
import hashlib
from functools import wraps

from flask import Flask, request, jsonify, g
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
import jwt

app = Flask(__name__)
CORS(
    app,
    origins=["*"],
    supports_credentials=False,
    allow_headers="*",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)

# === Configuration (use real secrets and env vars in prod) ===
GOOGLE_CLIENT_ID = os.environ.get(
    "GOOGLE_CLIENT_ID",
    "<your-google-client-id>.apps.googleusercontent.com",
)
JWT_SECRET = os.environ.get("JWT_SECRET", "change_this_to_a_strong_random_value")
ALLOWED_EMAILS = {os.environ.get("ALLOWED_EMAIL", "yourmomentsestetica@gmail.com")}

print(f"Using Google Client ID: {GOOGLE_CLIENT_ID[:4]}...")  # Show only first 4 chars for security
print(f"Using JWT secret: {JWT_SECRET[:4]}...")  
print(f"Allowed emails: {', '.join(ALLOWED_EMAILS)}")

# Token lifetime: 24 hours
ACCESS_TTL = 24 * 60 * 60  # seconds

def _compute_fingerprint():
    """Create a fingerprint based on client IP + User-Agent."""
    ua = request.headers.get("User-Agent", "")
    ip = request.remote_addr or ""
    digest = hashlib.sha256(f"{ip}|{ua}".encode()).hexdigest()
    return digest

def create_jwt(email: str):
    """Mint a JWT bound to the client fingerprint."""
    now = int(time.time())
    jti = str(uuid.uuid4())
    fp = _compute_fingerprint()
    payload = {
        "sub": email,          # subject
        "iat": now,            # issued at
        "exp": now + ACCESS_TTL,
        "jti": jti,            # token ID (optional if you want to log/revoke later)
        "fp": fp,              # fingerprint
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
    return token

def verify_jwt(token: str):
    """Validate JWT signature, expiry, allowlist, and fingerprint match."""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

    if payload.get("sub") not in ALLOWED_EMAILS:
        return None
    # Recompute fingerprint and compare
    expected_fp = payload.get("fp")
    if expected_fp != _compute_fingerprint():
        return None

    return payload

def require_jwt(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "missing bearer token"}), 401
        token = auth.split(None, 1)[1]
        payload = verify_jwt(token)
        if not payload:
            return jsonify({"error": "invalid or expired token"}), 401
        g.user_email = payload["sub"]
        return f(*args, **kwargs)
    return wrapper

@app.route("/auth/google", methods=["POST"])
def auth_google():
    data = request.get_json(silent=True) or {}
    idt = data.get("id_token")
    if not idt:
        return jsonify({"error": "missing id_token"}), 400

    # Verify Google ID token
    try:
        info = id_token.verify_oauth2_token(
            idt, grequests.Request(), GOOGLE_CLIENT_ID
        )
    except Exception as e:
        return jsonify({"error": "invalid google token", "details": str(e)}), 401

    email = info.get("email")
    if not info.get("email_verified") or email not in ALLOWED_EMAILS:
        return jsonify({"error": "forbidden"}), 403

    # Mint our JWT
    access_token = create_jwt(email)
    return jsonify({
        "access_token": access_token,
        "token_type": "Bearer",
        "expires_in": ACCESS_TTL,
        "email": email,
    })

@app.route("/protected-api", methods=["GET"])
@require_jwt
def protected():
    return jsonify({
        "message": f"Hello {g.user_email}, you've accessed a protected resource at {time.strftime('%Y-%m-%d %H:%M:%S', time.localtime())}",
    })

if __name__ == "__main__":
    # On localhost you can run as HTTP; in prod behind HTTPS always
    app.run(port=5000, debug=True)
