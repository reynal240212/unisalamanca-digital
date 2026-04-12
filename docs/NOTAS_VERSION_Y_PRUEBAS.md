# Notas de la Versión y Planes de Prueba

Este documento rastrea la evolución del sistema y define los protocolos para asegurar la calidad de las nuevas funcionalidades.

---

## 📅 Notas de la Versión (Release Notes)

### v1.0.0 (Lanzamiento Inicial - 2026-04-11)
- **Identidad Digital:** Implementación de carnet digital con Glassmorphism UI.
- **Seguridad QR:** Algoritmo de rotación basado en bloques de 30 segundos.
- **Onboarding:** Integración de aceptación de Ley 1581 (Protección de Datos).
- **Dashboards:** Vistas especializadas para Estudiantes, Docentes, Finanzas y Bienestar.
- **Core Supabase:** Integración completa con PostgreSQL y Authentication.

---

## 🧪 Planes de Prueba (Test Plans)

### Escenario 1: Validación de Acceso con QR Dinámico
**Objetivo:** Verificar que solo códigos válidos y recientes permitan el ingreso.
| Paso | Acción Esperada | Resultado |
| :--- | :--- | :--- |
| 1 | Generar QR en el celular del estudiante. | QR visible y rotando cada 30s. |
| 2 | Escanear con el dispositivo del guardia. | Autorización ✅. |
| 3 | Tomar captura de pantalla y esperar 1 min. | Error: Token expirado 🔴. |
| 4 | Suspender al estudiante en el panel Admin. | Error: Estudiante inactivo 🔴. |

### Escenario 2: Onboarding y Protección de Datos
**Objetivo:** Asegurar cumplimiento legal antes del uso del sistema.
| Paso | Acción Esperada | Resultado |
| :--- | :--- | :--- |
| 1 | Usuario nuevo inicia sesión. | Se muestra modal de términos legales. |
| 2 | Intenta cerrar el modal sin aceptar. | El sistema bloquea acceso al dashboard. |
| 3 | Acepta términos y condiciones. | Registro de `accepted_terms` en DB y acceso permitido. |

### Escenario 3: Carga Masiva de Estudiantes
**Objetivo:** Validar la integridad de datos en la importación masiva.
| Paso | Acción Esperada | Resultado |
| :--- | :--- | :--- |
| 1 | Subir archivo Excel con 50 estudiantes. | Procesamiento en <3 segundos. |
| 2 | Archivo con correos duplicados. | El sistema rechaza duplicados y reporta error. |
| 3 | Verificar en tabla `user`. | Registros creados correctamente con campos mapeados. |

---

## 🛠️ Guía de Mantenimiento

### Actualización de Dependencias
Para mantener el sistema seguro, se recomienda ejecutar mensualmente:
```bash
npm update
```
**Nota:** Preste especial atención a `@supabase/supabase-js`, ya que cambios en la API del cliente pueden requerir ajustes en los servicios de `src/services/`.

### Monitoreo de Logs
Los logs de acceso y errores se pueden consultar en:
1.  **Vercel Dashboard:** Para errores de frontend y despliegue.
2.  **Supabase Logs:** Para errores de base de datos y Edge Functions.

---
[Volver al README](file:///c:/Users/reyna/Desktop/unisalamanca-digital/README.md)
