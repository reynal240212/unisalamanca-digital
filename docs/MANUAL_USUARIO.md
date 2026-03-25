# Manual de Usuario - Identidad Digital UniSalamanca

Guía paso a paso para el uso de la plataforma de Identidad Digital Universitaria.

## 1. Módulo Administrador (Admin Panel)
URL: `/frontend/admin/index.html`

### 1.1 Registro Manual de Estudiantes
1.  Haz clic en el botón **"+ Registrar Estudiante"**.
2.  Completa los campos obligatorios: Nombre, Email, Programa, Modalidad y Fecha de Vencimiento.
    *   **Nota:** Si dejas la contraseña en blanco, se generará una automática.
3.  Opcionalmente, agrega la **Placa del Vehículo** y el **Tag RFID**.
4.  Haz clic en **"Guardar Estudiante"**.

### 1.2 Carga Masiva desde Excel
1.  Haz clic en el botón de **"Subida Masiva (Excel)"**.
2.  Selecciona el archivo `.xlsx` o `.csv`.
3.  El sistema procesará el listado automáticamente, asignando una contraseña temporal a cada estudiante.

### 1.3 Reportes y Acceso
*   **Dashboard de Accesos:** En la pestaña de reportes, puedes ver quién ha entrado al campus hoy.
*   **Filtros:** Usa la barra de búsqueda para filtrar por nombre, modalidad o estado de cuenta.

---

## 2. Módulo Estudiante (Student App)
URL: `/frontend/student/index.html`

### 2.1 Primer Ingreso y Onboarding
1.  Inicia sesión con tu correo institucional y contraseña.
2.  **Activación:** El sistema te pedirá una foto de rostro.
3.  Acepta la **Política de Tratamiento de Datos (Ley 1581)** marcando la casilla.
4.  Captura tu foto y haz clic en **"Guardar y Activar"**.

### 2.2 Uso del Carnet Digital
*   Tu carnet mostrará tus datos y un **Código QR Dinámico**.
*   **Importante:** El código cambia cada 30 segundos. No envíes capturas de pantalla, ya que el sistema de seguridad las rechazará.

---

## 3. Módulo de Seguridad (Validator App)
URL: `/frontend/validator/index.html`

### 3.1 Escaneo de QR
1.  Apunta la cámara del dispositivo al QR del estudiante.
2.  **Resultado Verde (✅):** Acceso permitido. Se muestra el nombre y foto del estudiante.
3.  **Resultado Rojo (❌):** Acceso denegado. Puede deberse a:
    *   Código QR expirado (el estudiante debe refrescar su pantalla).
    *   Cuenta suspendida o revocada.
    *   Ubicación fuera del campus autorizado.

### 3.2 Trazabilidad
*   Cada escaneo registra automáticamente la **Ubicación GPS** y la hora exacta en la base de datos central.
