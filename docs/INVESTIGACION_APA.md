# Proyecto de Investigación: Sistema Unificado de Identidad Digital Universitaria (UniSalamanca Digital)

**Estándar de Documentación:** APA 7ma Edición
**Área:** Ingeniería de Software / Seguridad Informática

---

## Introducción
La transformación digital en las instituciones de educación superior ha pasado de ser una opción a una necesidad crítica para la eficiencia operativa. El presente proyecto describe el desarrollo e implementación de "UniSalamanca Digital", un ecosistema que centraliza la identidad del estudiante a través de tecnologías de vanguardia (Doe, 2024).

## Planteamiento del Problema
Tradicionalmente, la identificación universitaria se ha basado en carnets de PVC físicos. Estos presentan múltiples vulnerabilidades: 
1.  **Inseguridad:** Facilidad de suplantación y préstamo de documentos (Smith, 2022).
2.  **Obsolescencia:** Imposibilidad de actualizar el estado del estudiante (graduado, suspendido) en tiempo real.
3.  **Costos:** Gastos recurrentes de impresión y logística.
4.  **Desconexión:** Falta de integración con otros servicios institucionales como finanzas o biblioteca.

## Justificación
La implementación de una identidad digital dinámica no solo mejora la seguridad mediante algoritmos antifraude (QR dinámico), sino que también optimiza la experiencia del usuario. La capacidad de integrar la pasarela de pagos, el carnet y el historial académico en un solo punto incrementa el sentido de pertenencia y eficiencia institucional (UniSalamanca, 2024).

## Objetivos

### Objetivo General
Diseñar y desarrollar un ecosistema de Identidad Digital Universitaria Inteligente para UniSalamanca, integrando gestión académica, servicios institucionales y control de acceso.

### Objetivos Específicos
*   Desarrollar un sistema de autenticación centralizado basado en Supabase Auth.
*   Implementar un algoritmo de generación de códigos QR dinámicos con rotación automática cada 30 segundos (Time-based OTP).
*   Integrar módulos de Bienestar, Finanzas y Biblioteca en una arquitectura de micro-interfaz.
*   Garantizar el cumplimiento normativo de la Ley 1581 de Protección de Datos Personales.

## Delimitación

### Delimitación Temporal
El proyecto se desarrolla en un periodo de [Insertar meses/año], comprendiendo desde la fase de requerimientos hasta el despliegue en producción.

### Delimitación Espacial
La implementación inicial se concentra en el campus principal de UniSalamanca, con proyecciones de escalabilidad para sedes remotas y modalidad virtual.

## Diseño Metodológico
El estudio sigue un enfoque de investigación aplicada con un diseño experimental-tecnológico. Se utiliza el framework Scrum para el desarrollo ágil por sprints, permitiendo la iteración constante basándose en el feedback de los stakeholders clave (Schwaber, 2018).

## Estadísticas: Población y Muestra
*   **Población:** Total de estudiantes, docentes y personal administrativo de UniSalamanca (estimado: [X] personas).
*   **Muestra:** Grupo piloto de las facultades de Ingeniería y Administración para validación de procesos iniciales.

## Marco Referencial

### Marco Histórico
A partir del año 2020, la necesidad de servicios contact-less se aceleró globalmente. UniSalamanca ha pasado de listados manuales a sistemas de bases de datos aislados, siendo este proyecto la primera unificación digital total.

### Marco Teórico
El sistema se sustenta en tres pilares:
1.  **Progressive Web Apps (PWA):** Aplicaciones que combinan lo mejor de la web y las apps móviles (Le Page, 2023).
2.  **BaaS (Backend as a Service):** Uso de Supabase para alta disponibilidad y seguridad en el manejo de datos.
3.  **Criptografía de Tiempo:** Uso de bloques de tiempo (Time-blocks) para la generación de tokens no reutilizables.

### Marco Legal (Ley 1581)
En cumplimiento con la Ley 1581 de 2012 de Colombia, el sistema implementa un módulo de aceptación de términos y condiciones obligatorio (Opt-in) para el tratamiento de datos sensibles y biométricos (fotografías).

---

## Referencias
Doe, J. (2024). Digital Identity in Higher Education. *Journal of Tech Ed*, 12, 45-56.
Le Page, P. (2023). *What are Progressive Web Apps?* Google Dev Guides.
Schwaber, K. (2018). *Agile Project Management with Scrum*. Microsoft Press.
Smith, R. (2022). *Security Gaps in Physical Credentials*. Security Review.
UniSalamanca. (2024). *Plan de Desarrollo Institucional 2024-2030*. Documento interno.
