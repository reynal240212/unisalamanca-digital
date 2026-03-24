# Script de inicialización con datos de prueba
from sqlmodel import Session
import uuid
from datetime import datetime, timedelta, timezone

try:
    from database import engine, create_db_and_tables
    from models import User, UserRole
    from security import get_password_hash
except ImportError:
    from backend.database import engine, create_db_and_tables
    from backend.models import User, UserRole
    from backend.security import get_password_hash

def init_data():
    create_db_and_tables()
    with Session(engine) as session:
        # Verificar si ya existen usuarios
        if session.query(User).first():
            print("Datos ya inicializados.")
            return

        # Contraseña predeterminada para todos: Unisalamanca2024*
        default_pwd_hash = get_password_hash("Unisalamanca2024*")

        # 1. Estudiante: Reynaldo Hernandez
        u1 = User(
            name="Reynaldo Hernandez",
            email="reynaldo@unisalamanca.edu.co",
            program="Ingeniería de Sistemas",
            role=UserRole.ESTUDIANTE,
            password_hash=default_pwd_hash,
            expiration_date=datetime.now(timezone.utc) + timedelta(days=365)
        )

        # 2. Estudiante: Dora Maria
        u2 = User(
            name="Dora Maria",
            email="dora@unisalamanca.edu.co",
            program="Administración de Empresas",
            role=UserRole.ESTUDIANTE,
            password_hash=default_pwd_hash,
            expiration_date=datetime.now(timezone.utc) + timedelta(days=365)
        )

        # 3. Validador: Juan Perez (Seguridad)
        u3 = User(
            name="Juan Perez",
            email="guardia@unisalamanca.edu.co",
            program=None,
            role=UserRole.VALIDADOR,
            password_hash=default_pwd_hash,
            must_change_password=True # También debe cambiarla
        )

        # 4. Admin (para pruebas)
        u4 = User(
            name="Admin Unisalamanca",
            email="admin@unisalamanca.edu.co",
            role=UserRole.ADMIN,
            password_hash=default_pwd_hash,
            must_change_password=False
        )

        session.add(u1)
        session.add(u2)
        session.add(u3)
        session.add(u4)
        session.commit()
        
        print(f"Base de datos inicializada con roles.")
        print(f"Estudiante: {u1.email}")
        print(f"Validador: {u3.email}")
        print(f"Contraseña predeterminada: Unisalamanca2024*")

if __name__ == "__main__":
    init_data()
