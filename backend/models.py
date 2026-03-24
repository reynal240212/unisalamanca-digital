from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from uuid import UUID, uuid4
from datetime import datetime, timezone
from enum import Enum

class UserRole(str, Enum):
    ESTUDIANTE = "ESTUDIANTE"
    VALIDADOR = "VALIDADOR"
    ADMIN = "ADMIN"

class UserBase(SQLModel):
    name: str
    email: str = Field(unique=True, index=True)
    program: Optional[str] = None # Solo para estudiantes
    role: UserRole = Field(default=UserRole.ESTUDIANTE)
    photo_url: Optional[str] = None
    status: str = "Active" # Active, Suspended, Revoked
    expiration_date: Optional[datetime] = None
    must_change_password: bool = Field(default=True)
    is_active: bool = Field(default=True)

class User(UserBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    password_hash: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    credentials: List["Credential"] = Relationship(back_populates="user")
    logs: List["AccessLog"] = Relationship(back_populates="user")

class Credential(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    token: str # El token dinámico que se codifica en el QR
    issued_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime
    
    user: User = Relationship(back_populates="credentials")

class AccessLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    location: str
    status: str # Granted, Denied
    reason: Optional[str] = None
    
    user: User = Relationship(back_populates="logs")
