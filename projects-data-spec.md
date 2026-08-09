# Spec — Completar la información de proyectos del portafolio (projects-data-spec)

> **Estado:** especificación aprobada para implementación (sin código aún).
> **Fecha:** 2026-08-09 · **Proyecto:** `portfolio-dev`
> **Cambio:** datos (JSON) — sin cambios de código ni del motor del CV.

---

## 1. Contexto

Los proyectos actuales en `src/data/en-cv.json` y `src/data/es-cv.json` son **placeholders**:
1. "Personal Web Portfolio"
2. "Full Stack Web Platform" (genérico)

El usuario tiene **2 proyectos reales**, investigados en sus repositorios públicos (front y back):

### 🛒 E-Shop — ecommerce de productos electrónicos
| | Repo |
|---|---|
| Front | `github.com/Kevinrua2003/e-shop_frontend` |
| Back | `github.com/Kevinrua2003/e-shop_backend` |

**Front** (README): Next.js 15 (App Router), React 19, Material UI (MUI), Tailwind CSS, NextAuth.js v5, Axios, React Hook Form, React Hot Toast + SweetAlert2, Framer Motion, Context API, React Icons.
- Catálogo con filtrado y búsqueda · carrito persistente · auth login/register · panel admin · tema claro/oscuro · responsive.

**Back** (README + schema Prisma): NestJS 11, TypeScript, PostgreSQL + Prisma 6, JWT (@nestjs/jwt) con cookies HTTP-only, Passport, bcryptjs, cookie-parser, Swagger.
- Modelo: `User` (roles USER/ADMIN), `Product` (nombre, descripción, precio, marca, categoría, stock, imagen), `Order` (estados + estado de entrega), `OrderItem`.
- CRUD de usuarios, productos y pedidos · Swagger en `/api` · tests e2e (Jest).

### 🎉 Events Decoration Manager — gestión de decoraciones de eventos
| | Repo |
|---|---|
| Front | `github.com/Kevinrua2003/events-decoration-front` |
| Back | `github.com/Kevinrua2003/events-decoration-back` |

**Front** (package.json): Next.js 15.2.4 (App Router), React 19, shadcn/ui (Radix UI + CVA + clsx + tailwind-merge + lucide-react), Tailwind CSS 4, NextAuth v4, axios, Recharts, react-day-picker, embla-carousel, cmdk.

**Back** (package.json + schema Prisma): NestJS 11, Prisma 6 + PostgreSQL, JWT + Passport (jwt/local), bcrypt, Swagger.
- Modelo: `Company`, `Client`, `Event` (tipo: WEDDING/BIRTHDAY/CORPORATE/OTHER, fechas, ubicación, monto), `Provider` → `Product`/`Service`, `Employee` (roles: CEO, HR_MANAGER, ACCOUNTING_MANAGER, UNION_SECRETARY, STAFF), `Contract` (único por cliente-evento) con `ContractItem` (producto/servicio + cantidad + precio) y `ContractModification` (historial de cambios del contrato).

---

## 2. Decisiones de la entrevista (vinculantes)

| Área | Decisión |
|---|---|
| **Alcance** | **Reemplazar los 2 placeholders** por los 2 proyectos reales (total: 2). |
| **Links** | `url` = repo **front** · `github` = repo **front** (por ahora). |
| **Deploys** | No hay todavía. El usuario planea desplegarlos: **más adelante** `url` apuntará a la demo y `github` al repo. (No cambia nada ahora.) |
| **Stack (chips web)** | **Combinado front + back** (ver §3). |
| **Highlights** | Redactados por el agente desde el análisis de los repos (ver §3). |
| **Enfoque** | **Capacidades del producto** (no el rol personal). |
| **Tono/longitud** | **Técnico-conciso** (descripción de 1-2 frases). |
| **Nombres** | EN: **E-Shop** / **Events Decoration Manager** · ES: **E-Shop** / **Gestor de Decoraciones de Eventos**. |
| **E-shop** | Describir como tienda de **productos electrónicos** (no catálogo genérico). |
| **CV generado** | **Dejar el motor como está**: el stack de proyectos **sí** sigue saliendo en el PDF/DOCX (se descarta el cambio en `toCvJson`). |

### Fuera de alcance
- No tocar `src/components/Projects.astro` (ya renderiza `stack`, `highlights`, `url`, `github`).
- No tocar el motor del CV (`src/lib/resume-engine/`), ni `toCvJson`.
- No añadir imágenes/screenshots (la UI de proyectos es texto + iconos, como está).
- No modificar i18n (los textos de proyectos viven en los JSON, no en `UIStrings`).

---

## 3. Contenido propuesto para los JSON (a confirmar/aplicar)

### Proyecto 1 — E-Shop
```jsonc
{
  "name": "E-Shop",
  "isActive": true,
  "description": "Full-stack e-commerce platform for electronics: product catalog with search and category filters, persistent shopping cart, orders with delivery status, and an admin panel to manage products and orders.",
  "highlights": [
    "Product catalog with search and category filtering",
    "Persistent shopping cart and order tracking with delivery status",
    "Role-based authentication (JWT + HTTP-only cookies) with customer and admin areas",
    "REST API documented with Swagger on a PostgreSQL + Prisma data model"
  ],
  "url": "https://github.com/Kevinrua2003/e-shop_frontend",
  "github": "https://github.com/Kevinrua2003/e-shop_frontend",
  "stack": {
    "Next.js": "simple-icons:nextdotjs",
    "React": "simple-icons:react",
    "NestJS": "simple-icons:nestjs",
    "PostgreSQL": "simple-icons:postgresql",
    "Prisma": "simple-icons:prisma",
    "Tailwind CSS": "simple-icons:tailwindcss",
    "MUI": "simple-icons:mui"
  }
}
```

**ES (nombre igual, resto traducido):**
```jsonc
{
  "name": "E-Shop",
  "isActive": true,
  "description": "Plataforma de comercio electrónico full-stack para productos electrónicos: catálogo con búsqueda y filtros por categoría, carrito de compras persistente, pedidos con estado de entrega y panel de administración para gestionar productos y pedidos.",
  "highlights": [
    "Catálogo de productos con búsqueda y filtrado por categoría",
    "Carrito de compras persistente y seguimiento de pedidos con estado de entrega",
    "Autenticación por roles (JWT + cookies HTTP-only) con áreas de cliente y administración",
    "API REST documentada con Swagger sobre un modelo de datos en PostgreSQL + Prisma"
  ],
  "url": "https://github.com/Kevinrua2003/e-shop_frontend",
  "github": "https://github.com/Kevinrua2003/e-shop_frontend",
  "stack": { /* igual que EN */ }
}
```

### Proyecto 2 — Events Decoration Manager
```jsonc
{
  "name": "Events Decoration Manager",
  "isActive": true,
  "description": "Full-stack application to manage event decoration contracts: clients, events, providers with products and services, and contracts with itemized resources and a modification history.",
  "highlights": [
    "Contract management linking clients and events with products and services",
    "Provider catalog with products and services per provider",
    "Contract modification history and employee roles (staff, HR, accounting, CEO)",
    "Role-based authentication (JWT) on a shadcn/ui (Radix) interface"
  ],
  "url": "https://github.com/Kevinrua2003/events-decoration-front",
  "github": "https://github.com/Kevinrua2003/events-decoration-front",
  "stack": {
    "Next.js": "simple-icons:nextdotjs",
    "React": "simple-icons:react",
    "NestJS": "simple-icons:nestjs",
    "PostgreSQL": "simple-icons:postgresql",
    "Prisma": "simple-icons:prisma",
    "Tailwind CSS": "simple-icons:tailwindcss",
    "shadcn/ui": "simple-icons:shadcnui"
  }
}
```

**ES:**
```jsonc
{
  "name": "Gestor de Decoraciones de Eventos",
  "isActive": true,
  "description": "Aplicación full-stack para gestionar contratos de decoración de eventos: clientes, eventos, proveedores con productos y servicios, y contratos con recursos detallados e historial de modificaciones.",
  "highlights": [
    "Gestión de contratos que vinculan clientes y eventos con productos y servicios",
    "Catálogo de proveedores con productos y servicios por proveedor",
    "Historial de modificaciones de contratos y roles de empleados (staff, RRHH, contabilidad, CEO)",
    "Autenticación por roles (JWT) con interfaz shadcn/ui (Radix)"
  ],
  "url": "https://github.com/Kevinrua2003/events-decoration-front",
  "github": "https://github.com/Kevinrua2003/events-decoration-front",
  "stack": { /* igual que EN */ }
}
```

> Iconos verificados disponibles (astro-icon incluye `simple-icons:["*"]`): `nextdotjs`, `react`, `nestjs`, `postgresql`, `prisma`, `tailwindcss`, `mui`, `shadcnui`.

---

## 4. Plan de trabajo

1. **`src/data/en-cv.json`**: reemplazar el array `projects` con el Proyecto 1 + Proyecto 2 (EN).
2. **`src/data/es-cv.json`**: reemplazar el array `projects` con las versiones ES (nombres/descripciones/highlights traducidos; `stack` igual).
3. **Validación** (ver §5).

## 5. Validación

1. **Build**: `pnpm build` (astro check) sin errores (los JSON son tipados por `cv-types.ts` — `Project` exige `name`, `isActive`, `description`, `highlights`).
2. **Navegador** (`http://localhost:4322`):
   - `/en/` y `/es/`: sección Proyectos muestra **2 tarjetas** (E-Shop + Events Decoration Manager / Gestor de Decoraciones de Eventos), chips de stack combinado, highlights, enlaces al repo front (url + icono GitHub).
   - Generar el CV (PDF/DOCX) y confirmar que la sección Projects incluye el stack de cada proyecto (el motor no cambia).

## 6. Notas

- Los `stack` son idénticos en EN/ES (las claves son nombres de tecnología, no se traducen).
- Si más adelante hay deploys: cambiar solo `url` → demo (mantener `github` → repo). Dejar anotado en el JSON como comentario no es posible (JSON puro) — documentarlo aquí.
- El orden del array define el orden de las tarjetas: E-Shop primero, Decoraciones después.
