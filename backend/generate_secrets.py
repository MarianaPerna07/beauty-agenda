# Python REPL
import secrets, base64
print(f"export JWT_SECRET={base64.urlsafe_b64encode(secrets.token_bytes(32)).decode()}")  # for JWT_SECRET
