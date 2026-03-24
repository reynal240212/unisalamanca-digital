from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, select
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta, timezone
import traceback
import os

from database import engine, get_session, create_db_and_tables
from models import User, UserRole, Credential, AccessLog
from security import (
    create_access_token, 
    create_qr_token, 
    decode_token, 
    verify_password, 
    get_password_hash,
    get_current_user,
    check_admin,
    check_validator
)

app = FastAPI(title="UniSalamanca Identity API")

# Habilitar CORS para las apps web
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # Ensure uploads directory exists
    uploads_dir = os.path.join(
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend")),
        "uploads"
    )
    os.makedirs(uploads_dir, exist_ok=True)
    print(f"Uploads dir: {uploads_dir}")

@app.get("/health")
def health_check():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc)}

# --- Auth Endpoints ---

@app.post("/login")
def login(email: str = Body(...), password: str = Body(...), session: Session = Depends(get_session)):
    try:
        print(f"INTENTO DE LOGIN: {email}")
        user = session.exec(select(User).where(User.email == email)).first()
        if not user:
            print(f"LOGIN FALLIDO: Usuario no encontrado {email}")
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        
        print(f"USUARIO ENCONTRADO: {user.name}, verificado hash...")
        if not verify_password(password, user.password_hash):
            print(f"LOGIN FALLIDO: Contraseña incorrecta para {email}")
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        
        if not user.is_active:
            print(f"LOGIN FALLIDO: Usuario inactivo {email}")
            raise HTTPException(status_code=403, detail="Cuenta suspendida")
        
        print(f"LOGIN EXITOSO: Generando token para {email}")
        token = create_access_token(data={"sub": str(user.id), "role": str(user.role.value)})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "role": user.role,
                "photo_url": user.photo_url,
                "must_change_password": user.must_change_password
            }
        }
    except Exception as e:
        print(f"ERROR CRITICO EN LOGIN: {e}")
        traceback.print_exc()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/change-password")
def change_password(
    user_id: UUID = Body(...),
    current_password: str = Body(...),
    new_password: str = Body(...),
    currentUser: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    if currentUser.id != user_id and currentUser.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="No tienes permiso para cambiar esta contraseña")
    
    user = session.get(User, user_id)
    if not user or not verify_password(current_password, user.password_hash):
        raise HTTPException(status_code=401, detail="Contraseña actual incorrecta")
    
    # Validar complejidad mínima (puedes expandir esto)
    if len(new_password) < 8:
        raise HTTPException(status_code=400, detail="La contraseña debe tener al menos 8 caracteres")
    
    user.password_hash = get_password_hash(new_password)
    user.must_change_password = False
    session.add(user)
    session.commit()
    
    return {"message": "Contraseña actualizada exitosamente"}

# --- Admin Endpoints (Gestión de Usuarios) ---

@app.post("/students/")
def create_student(user: User, adminUser: User = Depends(check_admin), session: Session = Depends(get_session)):
    try:
        # Asegurar que la fecha sea un objeto datetime
        if isinstance(user.expiration_date, str):
            user.expiration_date = datetime.fromisoformat(user.expiration_date.replace("Z", "+00:00"))
        
        # Las contraseñas de admin deben ser hasheadas si no vienen ya así
        if not user.password_hash:
             user.password_hash = get_password_hash("Unisalamanca2024*")
        
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    except Exception as e:
        session.rollback()
        print(f"ERROR create_user: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/students/", response_model=List[User])
def read_students(adminUser: User = Depends(check_admin), session: Session = Depends(get_session)):
    users = session.exec(select(User).where(User.role == UserRole.ESTUDIANTE)).all()
    return users

@app.get("/users/", response_model=List[User])
def read_all_users(adminUser: User = Depends(check_admin), session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@app.patch("/users/{user_id}/status")
def update_user_status(user_id: UUID, new_status: str, adminUser: User = Depends(check_admin), session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.status = new_status
    session.add(user)
    session.commit()
    return {"message": f"Estado de {user.name} actualizado a {new_status}"}

# --- Credential Endpoints ---

@app.get("/students/{user_id}", response_model=User)
def read_user(user_id: UUID, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        # Fallback for SQLite text IDs
        user = session.exec(select(User).where(User.id == str(user_id))).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@app.post("/students/{user_id}/upload-photo")
async def upload_photo(user_id: UUID, photo_data: str = Body(...), currentUser: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Solo el propio usuario o un admin pueden subir la foto
    if str(currentUser.id) != str(user_id) and currentUser.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="No tienes permiso para modificar este perfil")
    
    # Manejar base64
    import base64
    try:
        if "," in photo_data:
            header, encoded = photo_data.split(",", 1)
        else:
            encoded = photo_data
        
        file_ext = "jpg"
        if "png" in photo_data: file_ext = "png"
        
        filename = f"{user_id}_{int(datetime.now().timestamp())}.{file_ext}"
        filepath = os.path.join(frontend_path, "uploads", filename)
        
        with open(filepath, "wb") as f:
            f.write(base64.b64decode(encoded))
        
        photo_url = f"/uploads/{filename}"
        
        # SQLModel update - works for both DBs
        user = session.get(User, user_id)
        if not user:
            user = session.exec(select(User).where(User.id == str(user_id))).first()
            
        if not user:
             raise HTTPException(status_code=404, detail="Usuario no encontrado")
             
        user.photo_url = photo_url
        session.add(user)
        session.commit()
        
        return {"photo_url": photo_url}
    except Exception as e:
        print(f"Error saving photo: {e}")
        raise HTTPException(status_code=500, detail="Error al procesar la imagen")

@app.get("/students/{user_id}/qrcode")
def get_qr_code(user_id: UUID, currentUser: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Solo el propio usuario puede generar su código QR
    if str(currentUser.id) != str(user_id):
         raise HTTPException(status_code=403, detail="No autorizado para generar este QR")
    
    user = session.get(User, user_id)
    if not user:
        user = session.exec(select(User).where(User.id == str(user_id))).first()
        
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    if user.status != "Active":
        raise HTTPException(status_code=403, detail="La identidad no está activa")
    
    # Generar token dinámico (QR)
    token = create_qr_token(user_id)
    
    credential = Credential(
        user_id=user_id,
        token=token,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=2)
    )
    session.add(credential)
    session.commit()
    
    return {"qr_token": token, "expires_at": credential.expires_at}

# --- Entry Point Verification ---

@app.post("/verify")
def verify_access(
    qr_token: str = Body(...), 
    location: str = Body("Entrada Principal"), 
    validatorUser: User = Depends(check_validator),
    session: Session = Depends(get_session)
):
    # Ya no necesitamos validator_token manual porque viene en el header via Oauth2/Depends
    payload = decode_token(qr_token)
    if not payload or payload.get("type") != "qr":
        return {"status": "Denied", "reason": "Token QR inválido o expirado"}
    
    user_id = payload.get("sub")
    user = session.get(User, UUID(user_id))
    
    if not user:
        return {"status": "Denied", "reason": "Usuario no encontrado"}
    
    if user.status != "Active":
        return {"status": "Denied", "reason": f"Estado del usuario: {user.status}"}
    
    if user.expiration_date and user.expiration_date < datetime.now(timezone.utc):
        return {"status": "Denied", "reason": "Credencial expirada"}

    log = AccessLog(
        user_id=user.id,
        location=location,
        status="Granted"
    )
    session.add(log)
    session.commit()
    
    return {
        "status": "Granted",
        "student_name": user.name,
        "program": user.program,
        "photo_url": user.photo_url
    }

@app.get("/logs/", response_model=List[AccessLog])
def read_logs(adminUser: User = Depends(check_admin), session: Session = Depends(get_session)):
    logs = session.exec(select(AccessLog).order_by(AccessLog.timestamp.desc())).all()
    return logs

# --- Frontend Static Files & Routes ---

# Redirects for convenience
@app.get("/")
def read_index():
    return RedirectResponse(url="/student/login.html")

@app.get("/admin")
def read_admin():
    return RedirectResponse(url="/admin/index.html")

@app.get("/student")
def read_student():
    return RedirectResponse(url="/student/index.html")

@app.get("/validator")
def read_validator():
    return RedirectResponse(url="/validator/index.html")

# Servir la carpeta frontend completa
# Asumimos que la carpeta frontend está al mismo nivel que la carpeta backend
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
else:
    print(f"WARNING: Frontend path not found at {frontend_path}")
