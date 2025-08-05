import os
import time
import uuid
from flask import Flask, request, jsonify, make_response, g
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
from itsdangerous import TimestampSigner, BadSignature, SignatureExpired
import jwt

app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:3000"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"],
)


# === configure via env or hardcode for testing ===
GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "<your-client-id>.apps.googleusercontent.com")
SESSION_SECRET = os.environ.get("SESSION_SECRET", "supersecret_session_key_should_be_random")
ACCESS_TOKEN_SECRET = os.environ.get("ACCESS_TOKEN_SECRET", "another_random_secret_for_jwt")
ALLOWED_EMAILS = {"yourmomentsestetica@gmail.com"}  

print(f"Using Google Client ID: {GOOGLE_CLIENT_ID}")
print(f"Using Allowed Emails: {ALLOWED_EMAILS}")
print(f"Session Secret: {SESSION_SECRET[:4]}... (truncated for security)")
print(f"Access Token Secret: {ACCESS_TOKEN_SECRET[:4]}... (truncated for security)")
      

# constants
SESSION_COOKIE_NAME = "session"
SESSION_TTL_SECONDS = 3600
ACCESS_TOKEN_TTL_SECONDS = 300

signer = TimestampSigner(SESSION_SECRET)


# def create_session_token(email, session_id):
#     payload = f"{email}|{session_id}"
#     return signer.sign(payload).decode()


# def verify_session_token(token):
#     try:
#         unsigned = signer.unsign(token, max_age=SESSION_TTL_SECONDS).decode()
#         email, session_id = unsigned.split("|", 1)
#         if email not in ALLOWED_EMAILS:
#             return None
#         return email, session_id
#     except (SignatureExpired, BadSignature):
#         return None


def create_access_token(email, session_id):
    now = int(time.time())
    payload = {
        "sub": email,
        "sid": session_id,
        "iat": now,
        "exp": now + ACCESS_TOKEN_TTL_SECONDS,
        "jti": str(uuid.uuid4()),
    }
    return jwt.encode(payload, ACCESS_TOKEN_SECRET, algorithm="HS256")


def verify_access_token(token):
    try:
        payload = jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
        if payload.get("sub") not in ALLOWED_EMAILS:
            return None
        return payload
    except Exception:
        return None


# def set_session_cookie(resp, session_token):
#     resp.set_cookie(
#         SESSION_COOKIE_NAME,
#         session_token,
#         httponly=True,
#         secure=True,  # localhost, so no HTTPS; in prod set True
#         samesite="None",
#         max_age=SESSION_TTL_SECONDS,
#         path="/",
#     )


def require_dual_auth(f):
    from functools import wraps

    @wraps(f)
    def wrapper(*args, **kwargs):
        # session_token = request.cookies.get(SESSION_COOKIE_NAME)
        # if not session_token:
        #     return jsonify({"error": "no session"}), 401
        # verified = verify_session_token(session_token)
        # if not verified:
        #     return jsonify({"error": "invalid/expired session"}), 401
        # email, session_id = verified

        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return jsonify({"error": "no bearer token"}), 401
        bearer = auth.split(None, 1)[1]
        access_payload = verify_access_token(bearer)
        if not access_payload:
            return jsonify({"error": "invalid access token"}), 401


        # if access_payload.get("sub") != email or access_payload.get("sid") != session_id:
        #     return jsonify({"error": "mismatch"}), 403

        g.user_email = access_payload.get("sub")
        return f(*args, **kwargs)

    return wrapper

@app.before_request
def log_all():
    print(f"[incoming] {request.method} {request.path}")

@app.route("/auth/google", methods=["OPTIONS"])
def auth_google_preflight():
    print("Received OPTIONS preflight for /auth/google")
    response = make_response("", 204)
    return response


@app.route("/auth/google", methods=["POST"])
def auth_google():
    data = request.get_json() or {}
    id_token_str = data.get("id_token")
    if not id_token_str:
        return jsonify({"error": "missing id_token"}), 400

    try:
        idinfo = id_token.verify_oauth2_token(
            id_token_str,
            grequests.Request(),
            GOOGLE_CLIENT_ID,
        )
    except Exception as e:
        return jsonify({"error": "invalid token", "details": str(e)}), 401

    email = idinfo.get("email")
    print("DEBUG: email from ID token:", email)
    email_verified = idinfo.get("email_verified", False)
    print("DEBUG: email_verified:", email_verified)
    if not email_verified or email not in ALLOWED_EMAILS:
        return jsonify({"error": "forbidden"}), 403

    session_id = str(uuid.uuid4())
    print("DEBUG: Generated session_id:", session_id)
    # session_token = create_session_token(email, session_id)
    # print("DEBUG: Generated session_token:", session_token)
    access_token = create_access_token(email, session_id)
    print("DEBUG: Generated access_token:", access_token)

    resp = make_response(
        jsonify({
            "access_token": access_token,
            "token_type": "Bearer",
            "expires_in": ACCESS_TOKEN_TTL_SECONDS,
        })
    )
    # set_session_cookie(resp, session_token)
    return resp


# @app.route("/auth/refresh", methods=["POST"])
# def refresh():
#     session_token = request.cookies.get(SESSION_COOKIE_NAME)
#     if not session_token:
#         return jsonify({"error": "no session"}), 401
#     verified = verify_session_token(session_token)
#     if not verified:
#         return jsonify({"error": "invalid session"}), 401
#     email, session_id = verified
#     new_access = create_access_token(email, session_id)
#     return jsonify({"access_token": new_access, "expires_in": ACCESS_TOKEN_TTL_SECONDS})


@app.route("/auth/logout", methods=["POST"])
def logout():
    resp = make_response(jsonify({"status": "logged out"}))
    resp.set_cookie(SESSION_COOKIE_NAME, "", max_age=0, path="/")
    return resp


@app.route("/protected-api")
@require_dual_auth
def protected():
    return jsonify({"secret": f"Hello {g.user_email}, this is protected."})


if __name__ == "__main__":
    app.run(port=5000, debug=True)
