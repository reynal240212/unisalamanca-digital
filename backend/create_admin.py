from sqlmodel import Session, create_engine
from models import User, UserRole
from security import get_password_hash
from uuid import uuid4
from datetime import datetime, timezone

sqlite_url = "sqlite:///./unisalamanca.db"
engine = create_engine(sqlite_url)

def create_admin():
    with Session(engine) as session:
        # Verificar si ya existe
        email = "admin@unisalamanca.edu.co"
        existing = session.query(User).filter(User.email == email).first()
        if existing:
            print("Admin ya existe")
            return

        admin = User(
            id=uuid4(),
            name="Admin Sistema",
            email=email,
            password_hash=get_password_hash("AdminUnisalamanca2024*"),
            role=UserRole.ADMIN,
            is_active=True,
            must_change_password=False,
            expiration_date=None
        )
        session.add(admin)
        session.commit()
        print("Admin creado con éxito: admin@unisalamanca.edu.co / AdminUnisalamanca2024*")

if __name__ == "__main__":
    create_admin()
