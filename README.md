# UniSalamanca Digital - Identidad Universitaria Inteligente

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/Stack-React_18-61DAFB.svg)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E.svg)
![Vite](https://img.shields.io/badge/Tool-Vite-646CFF.svg)

## 🌟 Introducción
**UniSalamanca Digital** es un ecosistema integral de identidad y gestión universitaria. El sistema reemplaza el carnet físico tradicional por una credencial digital dinámica protegida por algoritmos antifraude, integrando servicios financieros, bienestar universitario y control de acceso en una sola plataforma premium.

### Propósito y Alcance
Resolver el problema de la seguridad física y la fragmentación de servicios estudiantiles mediante una Progressive Web App (PWA) de alto rendimiento que centraliza la identidad del estudiante desde el ingreso hasta su graduación.

---

## 🚀 Guía de Inicio Rápido

### Requisitos Previos
- Node.js (v18+)
- Cuenta en Supabase
- Credenciales de reCAPTCHA v3

### Configuración Local
1. **Clonar el repositorio:**
   ```bash
   git clone [url-repo]
   cd unisalamanca-digital
   ```
2. **Instalar dependencias:**
   ```bash
   npm install
   ```
3. **Variables de Entorno:**
   Crea un archivo `.env` en la raíz con:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_llave_anonima
   ```
4. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

---

## 📚 Documentación Detallada

Para facilitar la navegación, el proyecto se divide en dos grandes áreas:

### 🏛️ Componente Académico (Investigación)
Documentos estructurados bajo estándares universitarios para sustento de tesis o proyectos de grado.
- [Investigación - Formato APA 7](file:///c:/Users/reyna/Desktop/unisalamanca-digital/docs/INVESTIGACION_APA.md)
- [Investigación - Formato IEEE](file:///c:/Users/reyna/Desktop/unisalamanca-digital/docs/INVESTIGACION_IEEE.md)

### 💻 Componente Técnico (Software)
Guías orientadas al desarrollo, despliegue y uso del sistema.
- [Arquitectura Técnica y API](file:///c:/Users/reyna/Desktop/unisalamanca-digital/docs/TECNICO_ARQUITECTURA.md)
- [Manual de Usuario y FAQ](file:///c:/Users/reyna/Desktop/unisalamanca-digital/docs/MANUAL_USUARIO.md)
- [Notas de Versión y Pruebas](file:///c:/Users/reyna/Desktop/unisalamanca-digital/docs/NOTAS_VERSION_Y_PRUEBAS.md)

---

## 🛠️ Tecnologías Principales
- **Frontend:** React 18, Vite, Lucide React (Iconografía), Recharts (Gráficos).
- **Backend:** Supabase (Auth, PostgreSQL, Storage, Edge Functions).
- **Seguridad:** JWT, QR Dinámico (Time-based Tokens), reCAPTCHA.
- **Estética:** Glassmorphism UI con CSS optimizado.

---
© 2026 UniSalamanca Digital - Todos los derechos reservados.
