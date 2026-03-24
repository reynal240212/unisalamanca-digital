from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from typing import Optional
from uuid import UUID
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
import os
from dotenv import load_dotenv

from database import get_session
from models import User, UserRole

# Cargar variables de entorno
load_dotenv()

# Configuración para Seguridad de Contraseñas
# passlib manejará el algoritmo definido en esquemas
pwd_context = CryptContext(schemes=["bcrypt", "pbkdf2_sha256"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY", "unisalamanca-default-secret-key-change-it")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "480"))
QR_EXPIRE_MINUTES = int(os.getenv("QR_EXPIRE_MINUTES", "2"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_qr_token(user_id: UUID):
    expires_delta = timedelta(minutes=QR_EXPIRE_MINUTES)
    return create_access_token(data={"sub": str(user_id), "type": "qr"}, expires_delta=expires_delta)

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

# Dependencia para obtener el usuario actual mediante el token
def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar la sesión",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Simple SQLModel lookup - works natively in Postgres
    # For SQLite compatibility, we check if it's a UUID object or string
    try:
        user = session.get(User, UUID(user_id))
    except (ValueError, AttributeError):
        # Fallback for old tokens or non-UUID subs
        user = session.exec(select(User).where(User.id == user_id)).first()
    
    if user is None:
        # Final attempt: try direct string match (SQLite fix)
        user = session.exec(select(User).where(User.email == user_id)).first() # sub could be email in some configs
        if not user:
             # Try matching ID as string
             user = session.exec(select(User).where(User.id == str(user_id))).first()

    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
        
    return user

# Funciones de comprobación de roles
def check_admin(user: User = Depends(get_current_user)):
    if user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requieren privilegios de administrador"
        )
    return user

def check_validator(user: User = Depends(get_current_user)):
    if user.role not in [UserRole.ADMIN, UserRole.VALIDADOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tienes permiso para validar accesos"
        )
    return user
