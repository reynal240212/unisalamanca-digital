# Identidad Digital UniSalamanca 🏛️📱

Plataforma integral de gestión de identidad estudiantil, control de acceso y seguridad para UniSalamanca.

## 🚀 Características Principales
*   **Carnet Digital:** Identidad móvil para estudiantes con diseño premium.
*   **QR Dinámico Antifraude:** Generación de códigos rotativos cada 30 segundos.
*   **Panel Administrativo:** Gestión masiva de estudiantes (Excel), auditoría y reportes.
*   **Validador de Seguridad:** Aplicación para guardias con verificación en tiempo real y geolocalización GPS.
*   **Cumplimiento Legal:** Onboarding con aceptación de Ley 1581 (Tratamiento de Datos).
*   **Listo para el Futuro:** Campos preparados para integración con torniquetes RFID y barreras vehiculares (LPR).

## 🛠️ Stack Tecnológico
*   **Frontend:** HTML5, Vanilla CSS, JavaScript (ES6+).
*   **Backend:** Supabase (PostgreSQL, Auth, Storage).
*   **Seguridad:** Validador basado en Time-Blocks y firma institucional.

## 📂 Documentación
Para guías detalladas, consulta la carpeta `docs/`:
1.  [**Manual de Usuario**](docs/MANUAL_USUARIO.md): Guía para administradores, estudiantes y guardias.
2.  [**Manual Técnico**](docs/MANUAL_TECNICO.md): Arquitectura, base de datos y despliegue.
3.  [**Tabla de Requerimientos**](docs/REQUERIMIENTOS.md): Detalle de funcionalidades implementadas.

## 🛠️ Despliegue en Vercel
Para desplegar correctamente en Vercel, sigue estas configuraciones:
1.  **Build Command:** `npm run build`
2.  **Output Directory:** `.` (Esencial para que Vercel encuentre la carpeta `frontend/`)
3.  **Variables de Entorno:** Configura `SUPABASE_URL` y `SUPABASE_ANON_KEY` en los ajustes de Vercel.

## 🛠️ Instalación Local
1.  Clona el repositorio.
2.  Copia `frontend/env.example.js` a `frontend/env.js` y pon tus llaves.
3.  Sirve la carpeta raíz con cualquier servidor local (ej: `npx serve .`).

---
**Desarrollado para UniSalamanca** | 2026
