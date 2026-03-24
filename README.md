# 🆔 Sistema de Identidad Digital - UniSalamanca

Este proyecto es un MVP del sistema de carnetización digital para UniSalamanca, diseñado para entornos de producción reales.

## 🚀 Arquitectura Realizada

1.  **Backend (FastAPI)**: El núcleo del sistema. Gestiona la base de datos SQL (SQLite), genera tokens JWT para los QRs dinámicos y valida los accesos.
2.  **App Estudiante (Frontend)**: Una interfaz premium que muestra el carnet digital y un código QR que se refresca cada 2 minutos automáticamente.
3.  **Panel Admin (Frontend)**: Interfaz para que el personal universitario gestione la activación o suspensión de las credenciales en tiempo real.

## 🛠️ Cómo Ejecutar el Proyecto

### 1. Preparar el Backend
Navega a la carpeta `backend` y ejecuta:
```bash
pip install -r requirements.txt
python init_db.py  # Inicializa la base de datos con datos de prueba
uvicorn main:app --reload
```
El API estará disponible en `http://localhost:8000`.

### 2. Ejecutar las Apps Web
Puedes abrir los archivos `index.html` directamente en tu navegador o usar una extensión como "Live Server" en VS Code:
- **Estudiante**: `frontend/student/index.html`
- **Administrador**: `frontend/admin/index.html`

## 🛡️ Seguridad Implementada
- **QR Dinámico**: No codifica datos del estudiante en texto plano. Usa un JWT firmado por el servidor que expira en 2 minutos.
- **Validación del Lado del Servidor**: El carnet solo se muestra si el estado del estudiante está "Active". Cada escaneo se registra en la base de datos.
- **UUID Único**: Cada estudiante es identificado por un identificador universal único (UUID4).

## 📊 Roadmap del Proyecto
- [x] Capa 1: Núcleo de Identidad (Backend + DB)
- [x] Capa 2: Credencial Digital (Web App Estudiante)
- [x] Capa 3: Panel Administrativo
- [ ] Integración con Azure SQL Server (Pendiente)
- [ ] Integración con Tornos Físicos / Lectores QR
