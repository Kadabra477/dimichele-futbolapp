# ⚽ FutbolApp — Promiedos Clone 🇦🇷

¡Bienvenido a **FutbolApp**! Una Single Page Application (SPA) de alto rendimiento desarrollada en **Angular v21** e inspirada en la popular plataforma argentina de resultados deportivos *Promiedos*. Este proyecto fue diseñado y desplegado como parte del 2° Examen de Proceso para la cátedra de **Programación V** en la **Universidad Champagnat**.

---

## 🚀 Enlaces del Proyecto
* **Sitio Web Publicado:** [dimichele-futbolapp.web.app](https://dimichele-futbolapp.web.app)
* **Repositorio GitHub:** [github.com/Kadabra477/dimichele-futbolapp](https://github.com/Kadabra477/dimichele-futbolapp)

---

## 🛠️ Stack Tecnológico Utilizado

El ecosistema del proyecto fue estructurado bajo estricto cumplimiento de los requerimientos de software estipulados:

* **Entorno de Ejecución:** Node.js v24.16.0 LTS
* **Framework Frontend:** Angular CLI v21.2.16 (Arquitectura moderna basada en *Componentes Autónomos*)
* **Lenguaje:** TypeScript
* **Estilos y Maquetación:** TailwindCSS v4 + Componentes de UI (Spartan)
* **Gestión Asíncrona:** RxJS (Programación reactiva basada en Observables)
* **Proveedor de Datos:** API-Sports (Football API REST v3)
* **Plataforma Cloud:** Firebase Hosting

---

## ✨ Características Principales

* **Consumo Asíncrono Real:** Integración directa con endpoints de producción deportivos mediante `HttpClient`.
* **Buscador Reactivo Inteligente:** Barra de filtrado por texto optimizada con `debounceTime(150)` y `startWith` para evitar la saturación de peticiones al servidor mientras el usuario escribe.
* **Filtrado Geográfico:** Panel de control lateral para segmentar instantáneamente los encuentros por continentes o categorías (América, Europa, Asia, África, Oceanía, Mundial).
* **Arquitectura Resiliente (Mecanismo de Contingencia):** En caso de agotamiento de cuotas de la API gratuita o discrepancias horarias de los servidores UTC, el sistema inyecta automáticamente una estructura de datos local con partidos reales para garantizar la disponibilidad absoluta de la interfaz.

---

## 📁 Estructura del Proyecto Clave

```text
src/
├── app/
│   ├── models/
│   │   └── futbol.model.ts      # Interfaces de tipado estricto para las ligas y partidos
│   ├── services/
│   │   └── futbol.service.ts    # Servicio HTTP con inyección de cabeceras y lógica horaria
│   ├── app.component.ts         # Controlador reactivo principal y lógica de filtrado
│   ├── app.component.html       # Interfaz adaptativa estructurada con la nueva sintaxis (@if, @for)
│   └── app.config.ts            # Configuración global de la SPA
└── styles.css                   # Directivas y utilidades base de TailwindCSS
