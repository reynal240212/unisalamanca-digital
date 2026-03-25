# Documento de Requerimientos - Identidad Digital UniSalamanca

Este documento detalla los requerimientos funcionales y técnicos implementados en la plataforma de Identidad Digital Universitaria.

## 1. Requerimientos Funcionales (RF)

| ID | Requerimiento | Descripción | Estado |
| :--- | :--- | :--- | :--- |
| **RF-01** | **Gestión de Estudiantes** | El administrador puede crear, editar y visualizar estudiantes con campos específicos (Nombre, Email, Programa, Modalidad). | ✅ Completo |
| **RF-02** | **Carga Masiva (Excel)** | Capacidad de importar listados de estudiantes desde archivos Excel/CSV con validación automática. | ✅ Completo |
| **RF-03** | **Credencial Digital QR** | Generación de una identidad visual (carnet) accesible desde el móvil del estudiante. | ✅ Completo |
| **RF-04** | **QR Dinámico (Antifraude)** | El código QR rota cada 30 segundos usando un token basado en tiempo para evitar capturas de pantalla malintencionadas. | ✅ Completo |
| **RF-05** | **Validación de Acceso** | Una aplicación de validador (Guardia) que escanea códigos QR y verifica el estado (Activo/Suspendido) en tiempo real. | ✅ Completo |
| **RF-06** | **Seguridad por Geovalla** | El validador registra la ubicación GPS del escaneo para asegurar que los accesos ocurran dentro de las instalaciones. | ✅ Completo |
| **RF-07** | **Reportes de Acceso** | Dashboard administrativo para filtrar ingresos por fecha, programa y modalidad. | ✅ Completo |
| **RF-08** | **Cumplimiento Ley 1581** | Proceso de onboarding que obliga al estudiante a aceptar la política de tratamiento de datos antes de activar su credencial. | ✅ Completo |
| **RF-09** | **Gestión de Ciclo de Vida** | Estados de cuenta: Activo, Suspendido, Egresado y Revocado. | ✅ Completo |
| **RF-10** | **Multimodalidad LPR/RFID** | Campos preparados para integrar placas vehiculares y tags de proximidad. | ✅ Completo |

## 2. Requerimientos No Funcionales (RNF)

| ID | Requerimiento | Especificación |
| :--- | :--- | :--- |
| **RNF-01** | **Persistencia** | Uso de Supabase para base de datos relacional (PostgreSQL) y Auth. |
| **RNF-02** | **Seguridad** | Cifrado de datos en reposo y tránsito (TLS 1.3). Hashing de contraseñas con bcrypt. |
| **RNF-03** | **Interfaz** | Diseño premium con glassmorphism, tipografía moderna (Outfit) y responsividad móvil total. |
| **RNF-04** | **Rendimiento** | Validación de QR en menos de 500ms tras el escaneo. |
| **RNF-05** | **Almacenamiento** | Manejo de fotografías de estudiantes en Supabase Storage con redimensionamiento dinámico. |

## 3. Reglas de Negocio (BR)

1.  **BR-01**: Solo estudiantes con estado `Active` pueden generar un QR válido para acceso físico.
2.  **BR-02**: El token del QR tiene una validez de ±60 segundos para compensar desfases de reloj entre dispositivos.
3.  **BR-03**: La primera vez que un estudiante ingresa, es obligatorio que se tome una foto (Onboarding).
4.  **BR-04**: El administrador puede revocar o suspender una credencial en tiempo real, invalidando el acceso de inmediato.
