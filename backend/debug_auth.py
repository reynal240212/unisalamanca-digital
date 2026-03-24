from sqlmodel import Session, select, create_engine
from models import User
from security import verify_password, get_password_hash
import os

sqlite_url = "sqlite:///./unisalamanca.db"
engine = create_engine(sqlite_url)

def debug():
    with Session(engine) as session:
        email = "reynaldo@unisalamanca.edu.co"
        print(f"Buscando usuario: {email}")
        user = session.exec(select(User).where(User.email == email)).first()
        
        if not user:
            print("Usuario no encontrado")
            return
            
        print(f"Usuario encontrado: {user.name}")
        print(f"Hash en DB: {user.password_hash}")
        
        test_pass = "Unisalamanca2024*"
        try:
            is_valid = verify_password(test_pass, user.password_hash)
            print(f"¿Contraseña '{test_pass}' es válida? {is_valid}")
        except Exception as e:
            print(f"Error al verificar contraseña: {e}")

if __name__ == "__main__":
    debug()
