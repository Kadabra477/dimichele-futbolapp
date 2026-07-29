# ⚽ FutbolApp — Promiedos Clone 🇦🇷

¡Bienvenido a **FutbolApp**! Una Single Page Application (SPA) moderna, robusta y de alto rendimiento desarrollada en **Angular** e inspirada en la popular plataforma argentina de resultados deportivos *Promiedos*. Este proyecto fue diseñado, desarrollado y desplegado como parte del 2° Examen de Proceso para la cátedra de **Programación V** en la **Universidad Champagnat**.

---

## 🚀 Enlaces del Proyecto

* **Sitio Web Publicado (Firebase Hosting):** [dimichele-futbolapp.web.app](https://dimichele-futbolapp.web.app)
* **Repositorio GitHub:** [github.com/Kadabra477/dimichele-futbolapp](https://github.com/Kadabra477/dimichele-futbolapp)

---

## 👥 Integrantes del Equipo
* **Hernán Di Michele**
* **Alejo Ponce**

---

## 🛠️ Stack Tecnológico Utilizado

El ecosistema del proyecto fue estructurado bajo estricto cumplimiento de los requerimientos académicos:
* **Entorno de Ejecución:** Node.js v24 LTS
* **Framework Frontend:** Angular (Arquitectura moderna basada en **Componentes Autónomos / Standalone Components**)
* **Lenguaje:** TypeScript (Tipado estricto)
* **Estilos y Maquetación:** Tailwind CSS (Diseño responsivo y tema oscuro adaptativo)
* **Base de Datos y Backend as a Service (BaaS):** Firebase Firestore & Firebase Authentication
* **Gestión Asíncrona:** RxJS (Programación reactiva basada en Observables y tuberías)
* **Proveedor de Datos Deportivos:** API-Sports (Football API REST v3)
* **Librerías de Terceros:** `jsPDF` (Generación de reportes locales en PDF)
* **Plataforma Cloud:** Firebase Hosting

---

## ✨ Características Principales

1. **Consumo Asíncrono de Datos en Vivo:** Integración directa mediante `HttpClient` con endpoints de producción deportivos, complementada con un ajuste horario inteligente que evalúa la franja horaria para asegurar la visualización de los partidos vigentes.
2. **Buscador Reactivo Inteligente:** Barra de filtrado por texto optimizada con `debounceTime(150)` y `startWith` para garantizar fluidez y evitar sobrecargas de procesamiento en el cliente.
3. **Filtrado Geográfico y por Estado:** Panel lateral dinámico para segmentar los encuentros por continentes (América, Europa, Asia, África, Oceanía, Mundial) y por estado del partido (*En Vivo*, *Finalizados*, *Próximos*).
4. **Módulo de Autenticación y Seguridad (`AuthGuard`):** Sistema de acceso con Firebase Auth y guardianes de ruta (`CanActivateFn`) que protegen las secciones privadas de la plataforma.
5. **Gestión de Favoritos (CRUD Firestore):** Permite a los usuarios autenticados registrar, actualizar y eliminar sus equipos o ligas favoritas sincronizados en tiempo real con Cloud Firestore.
6. **Exportación de Reportes a PDF:** Funcionalidad avanzada orientada al cliente que recopila los datos de favoritos y genera un documento PDF estructurado y portable de manera local mediante `jsPDF`.
7. **Sistema de Reseñas y Comentarios Interactivos:** Modal flotante asociado a cada encuentro deportivo que permite emitir calificaciones estelares (1 a 5) y opiniones textuales, incorporando una validación estricta en el cliente para prevenir comentarios duplicados por usuario.

---

## 📁 Estructura del Proyecto Clave

```text
src/
├── app/
│   ├── comentarios/
│   │   └── comentarios.ts       # Componente modal de reseñas y calificaciones por partido
│   ├── favoritos/
│   │   ├── favoritos.html       # Vista del CRUD de favoritos y botón de exportación PDF
│   │   └── favoritos.ts         # Lógica de gestión de Firestore y generación de jsPDF
│   ├── login/
│   │   ├── login.html           # Interfaz de inicio de sesión y registro
│   │   └── login.ts             # Controlador de Firebase Authentication
│   ├── partidos/
│   │   ├── partidos.html        # Vista principal de resultados, filtros y listado por ligas
│   │   └── partidos.ts          # Lógica central, transformación de datos y filtros reactivos
│   ├── models/
│   │   └── futbol.model.ts      # Interfaces de tipado estricto (PartidoFormateado, LigaAgrupada)
│   ├── services/
│   │   ├── futbol.service.ts    # Servicio de consumo HTTP de la API de fútbol
│   │   ├── favoritos.service.ts # Conexión CRUD asíncrona con Cloud Firestore
│   │   └── comentarios.service.ts # Gestión de reseñas y opiniones en tiempo real
│   ├── app.config.ts            # Configuración global y proveedores de Firebase y Rutas
│   ├── app.routes.ts            # Árbol de navegación y asignación de AuthGuards
│   ├── auth.ts                  # Servicio de estado de sesión
│   └── auth-guard.ts            # Guardián de ruta para protección de accesos
└── styles.css                   # Directivas y utilidades base de Tailwind CSS
