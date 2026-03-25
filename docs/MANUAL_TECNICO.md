# Manual Técnico - Identidad Digital UniSalamanca

Este documento describe la arquitectura, stack tecnológico y lógica interna del sistema.

## 1. Arquitectura del Sistema
El sistema sigue una arquitectura de **Aplicación Web Progresiva (PWA)** basada en microservicios delegados a **Supabase**.

*   **Frontend:** HTML5, Vanilla CSS3 (Glassmorphism), JavaScript (ES6+).
*   **Backend-as-a-Service:** Supabase (Auth, PostgreSQL, Storage, Realtime).
*   **Librerías Clave:**
    *   `qrcodejs`: Generación de códigos QR en el cliente.
    *   `html5-qrcode`: Escaneo de QR de alta velocidad.
    *   `xlsx (SheetJS)`: Procesamiento de carga masiva desde Excel.

## 2. Modelo de Datos (Base de Datos)
Tablas principales en el esquema `public`:

### 2.1 Tabla `user`
Almacena la identidad central de estudiantes y administradores.
*   `id` (UUID): Identificador único institucional.
*   `email` (TEXT): Correo electrónico (único).
*   `status` (TEXT): `Active`, `Suspended`, `Egresado`, `Revoked`.
*   `study_modality` (TEXT): `Presencial`, `PAT`.
*   `plate_number` (TEXT): Para integración LPR.
*   `rfid_tag` (TEXT): Para integración física.

### 2.2 Tabla `credential`
Maneja los tokens rotativos de acceso.
*   `token` (TEXT): El contenido firmado del QR.
*   `expires_at` (TIMESTAMP): Fecha de caducidad (normalmente +1 min).

### 2.3 Tabla `accesslog`
Registro histórico de entradas al campus.
*   `location`: Coordenadas GPS del escaneo.
*   `user_id`: Referencia al estudiante.

## 3. Lógica de Seguridad: QR Dinámico
El sistema implementa una rotación basada en **Time-Blocks**:
1.  **Generación:** Se divide el timestamp actual por 30 segundos: `timeBlock = Math.floor(Date.now() / 30000)`.
2.  **Payload:** El QR contiene `UNIS|{studentId}|{timeBlock}`.
3.  **Validación:** El escáner recalcula el `timeBlock` y permite una diferencia de ±1 (ventana de 60s) para mitigar latencias de red o desincronización de reloj.

## 4. Despliegue y Mantenimiento
1.  **Seguridad de Credenciales (Vercel):**
    *   Las llaves ya **no están hardcodeadas** en el repositorio.
    *   Se utiliza un script de construcción (`scripts/build-env.js`) que se ejecuta en Vercel.
    *   **Variables Requeridas:** En el panel de Vercel, debes configurar:
        *   `SUPABASE_URL`
        *   `SUPABASE_ANON_KEY`
    *   El proceso de build genera automáticamente `frontend/env.js`, el cual es cargado por los archivos HTML.
2.  **Almacenamiento:** Las fotos de perfil se guardan en el bucket `student-photos` con políticas de lectura pública.
3.  **Hosting:** El proyecto está optimizado para Vercel, utilizando el comando de build `npm run build`.
