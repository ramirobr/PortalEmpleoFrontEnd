# DESIGN.md — Portal Empleo Frontend

> **Implica** — *Conecta, Certifica, Crece*  
> Plataforma de empleo construida con Next.js 16, React 19, TypeScript y Tailwind CSS 4.

---

## Tabla de Contenidos

1. [Visión General del Proyecto](#1-visión-general-del-proyecto)
2. [Stack Tecnológico](#2-stack-tecnológico)
3. [Estructura de Directorios](#3-estructura-de-directorios)
4. [Sistema de Diseño (Design System)](#4-sistema-de-diseño-design-system)
5. [Arquitectura de la Aplicación](#5-arquitectura-de-la-aplicación)
6. [Autenticación y Autorización](#6-autenticación-y-autorización)
7. [Estado Global (Zustand)](#7-estado-global-zustand)
8. [API Client y Capa de Datos](#8-api-client-y-capa-de-datos)
9. [Rutas y Páginas](#9-rutas-y-páginas)
10. [Componentes](#10-componentes)
11. [Tipos TypeScript](#11-tipos-typescript)
12. [Testing y Accesibilidad](#12-testing-y-accesibilidad)
13. [Scripts y Herramientas](#13-scripts-y-herramientas)
14. [Estándares de Desarrollo](#14-estándares-de-desarrollo)
15. [Flujos de Usuario](#15-flujos-de-usuario)
16. [Notificaciones en Tiempo Real](#16-notificaciones-en-tiempo-real)

---

## 1. Visión General del Proyecto

**PortalEmpleo** (nombre de marca: **Implica**) es una plataforma de empleo que conecta tres tipos de usuarios:

| Tipo de usuario | Rol interno | Área principal |
|---|---|---|
| Postulante (buscador de empleo) | `Postulante` | `/perfil` |
| Empresa / Empleador | `Administrador Empresa` / `Administrador de empresa` | `/empresa-perfil` |
| Administrador de plataforma | `Administrador Sistema` | `/admin` |

La aplicación opera en español (Ecuador) y utiliza la cédula ecuatoriana como documento de identidad principal.

**Repositorio:** `ramirobr/PortalEmpleoFrontEnd`  
**Branch activo:** `RB/companyMethods`

---

## 2. Stack Tecnológico

### Núcleo

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | `^16.0.10` | Framework (App Router + SSR/SSG) |
| React | `19.2.1` | UI Library |
| TypeScript | `^5` | Lenguaje (modo estricto) |
| Node.js | `^20` (tipos) | Runtime |

### Estilos

| Tecnología | Versión | Rol |
|---|---|---|
| Tailwind CSS | `^4.1.16` | Utility-first CSS |
| PostCSS | `^8.5.6` | Procesador CSS |
| tw-animate-css | `^1.4.0` | Animaciones Tailwind |
| `@tailwindcss/container-queries` | `^0.1.1` | Consultas de contenedor |
| `clsx` + `tailwind-merge` | `^2.1.1` / `^3.4.0` | Composición de clases (`cn()`) |

### UI Components

| Librería | Uso |
|---|---|
| Radix UI Primitives | Accordion, Avatar, Checkbox, Dialog, Dropdown Menu, Label, Popover, Scroll Area, Select, Slider, Slot, Switch, Tabs, Tooltip |
| Lucide React | Íconos vectoriales |
| Sonner | Toast notifications |
| Swiper | Carruseles (testimonios) |
| `cmdk` | Command palette |
| `react-day-picker` | Selector de fechas |
| `@vis.gl/react-google-maps` | Mapa para selección de ubicación |

### Estado y Lógica

| Librería | Versión | Rol |
|---|---|---|
| Zustand | `^5.0.9` | Estado global del cliente |
| React Hook Form | `^7.66.0` | Manejo de formularios |
| Zod | `^4.1.12` | Validación de esquemas |
| NextAuth | `^5.0.0-beta.30` | Autenticación JWT |
| next-themes | `^0.4.6` | Temas (claro/oscuro) |

### Utilidades

| Librería | Uso |
|---|---|
| `date-fns` | Manipulación y formato de fechas (locale: `es`) |
| `libphonenumber-js` | Validación y formato de teléfonos |
| `@microsoft/signalr` | WebSockets para notificaciones en tiempo real |

### Testing y QA

| Herramienta | Rol |
|---|---|
| Playwright | E2E testing + accesibilidad |
| `@axe-core/playwright` | Auditoría automática WCAG 2.1 AA |
| `@guidepup/playwright` + `@guidepup/setup` | Simulación de screen readers (NVDA/VoiceOver) |
| Puppeteer + `@axe-core/puppeteer` | Pruebas adicionales de accesibilidad |

---

## 3. Estructura de Directorios

```
PortalEmpleoFrontEnd/
├── app/                          # App Router de Next.js
│   ├── layout.tsx                # Root layout (fuentes, auth, toaster)
│   ├── page.tsx                  # Home page (landing pública)
│   ├── providers.tsx             # SessionProvider + SignalR client
│   ├── styles/
│   │   ├── globals.css           # Importaciones globales CSS
│   │   ├── generated-tokens.css  # AUTO-GENERADO desde design-tokens.json
│   │   └── layout/
│   │       ├── theme.css         # Base del tema (body, .container, hr)
│   │       ├── buttons.css       # Clases .btn, .btn-primary, etc.
│   │       ├── forms.css         # Estilos base de inputs y selects
│   │       ├── typography.css    # .section-title
│   │       └── swiper.css        # Estilos del carrusel Swiper
│   ├── auth/                     # Rutas de autenticación
│   │   ├── login/                # Login con credenciales
│   │   ├── crear/                # Registro de postulante
│   │   ├── email/                # Registro por email (servicios profesionales)
│   │   ├── empresa/              # Registro de empresa
│   │   ├── signin/               # Redirect helper
│   │   ├── forgot-password/      # Recuperación de contraseña
│   │   └── reset-password/       # Reseteo de contraseña
│   ├── perfil/                   # Dashboard del Postulante
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── layout.tsx            # Layout con menú lateral
│   │   ├── editar/               # Edición de perfil personal
│   │   ├── favoritos/            # Empleos guardados como favoritos
│   │   ├── archivos/             # Gestión de CV y documentos
│   │   ├── cambiar-contrasena/   # Cambio de contraseña
│   │   ├── recomendaciones/      # Recomendaciones de otros usuarios
│   │   ├── testimonios/          # Testimonios del postulante
│   │   └── perfil-publico/       # Vista pública del perfil
│   ├── empresa-perfil/           # Dashboard de la Empresa
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── layout.tsx            # Layout con menú lateral
│   │   ├── perfil/               # Perfil de la empresa
│   │   ├── empleos/              # Gestión de vacantes publicadas
│   │   ├── crear-empleo/         # Crear nueva vacante
│   │   ├── buscar-candidatos/    # Búsqueda avanzada de candidatos
│   │   ├── candidato/            # Detalle de candidato individual
│   │   ├── postulaciones/        # Lista de postulaciones recibidas
│   │   ├── archivos/             # Gestión de archivos empresariales
│   │   └── cambiar-contrasena/   # Cambio de contraseña
│   ├── admin/                    # Panel de Administración del Sistema
│   │   ├── page.tsx              # Dashboard admin
│   │   ├── layout.tsx            # Layout admin
│   │   ├── usuarios/             # Gestión de usuarios
│   │   ├── empresas/             # Gestión de empresas
│   │   ├── empleos/              # Gestión global de empleos
│   │   ├── candidatos/           # Gestión de candidatos
│   │   ├── catalogos/            # Gestión de catálogos del sistema
│   │   ├── roles/                # Gestión de roles
│   │   ├── testimonios/          # Moderación de testimonios
│   │   ├── blogs/                # Gestión de blogs
│   │   ├── archivos-candidato/   # Archivos de candidatos
│   │   └── archivos-empresa/     # Archivos de empresas
│   ├── empleos-busqueda/         # Búsqueda pública de empleos
│   ├── empleos/                  # Detalle de empleo individual
│   ├── buscar-candidatos/        # Landing para empresas (pública)
│   ├── blog/                     # Blog de la plataforma
│   ├── ayuda/                    # Centro de ayuda
│   ├── contrato/                 # Términos de contrato
│   ├── cookies/                  # Política de cookies
│   ├── privacidad/               # Política de privacidad
│   └── terminos/                 # Términos y condiciones
├── components/
│   ├── AuthHydrator.tsx          # Sincroniza sesión de NextAuth → Zustand
│   ├── NotificationRealtimeClient.tsx  # Cliente SignalR para notificaciones
│   ├── shared/
│   │   ├── components/           # Componentes reutilizables (ver §10)
│   │   ├── icons/                # SVG/icon components personalizados
│   │   ├── layout/
│   │   │   └── MainLayout.tsx    # Layout principal con Navbar
│   │   └── tituloSubrayado.tsx   # Componente de título con subrayado
│   └── ui/                       # Wrappers de Radix UI (ver §10.2)
├── context/
│   └── authStore.ts              # Store Zustand de autenticación
├── lib/                          # Lógica de negocio y utilidades
│   ├── apiClient.ts              # fetchApi() — cliente HTTP central
│   ├── utils.ts                  # cn(), formatDate(), getInitials(), etc.
│   ├── url.ts                    # normalizeWebsiteUrl()
│   ├── navigation.tsx            # Helpers de navegación
│   ├── hooks.tsx                 # Custom hooks (useDebouncedValue, etc.)
│   ├── auth/                     # signin/signup API wrappers
│   ├── blog/                     # Fetching de artículos de blog
│   ├── catalog/                  # Catálogos del sistema (tipos, listas)
│   ├── company/                  # Perfil de empresa y métodos
│   ├── jobs/                     # Vacantes (recent, favorites, job detail)
│   ├── search/                   # Búsqueda de empleos y candidatos
│   ├── testimonials/             # Testimonios
│   ├── user/                     # Info de usuario, curriculum, foto
│   ├── admin/                    # Funcionalidades del panel admin
│   └── mocks/                    # Datos de prueba (JSON)
├── types/                        # Definiciones TypeScript
│   ├── auth.ts                   # ROLES constant, KnownRole, Roles
│   ├── user.ts                   # LoginData, UserInfoData, Curriculum, etc.
│   ├── jobs.ts                   # Job, Jobs, RecentJob, etc.
│   ├── company.ts                # CompanyProfileData, OfertaEmpleo, etc.
│   ├── search.ts                 # Filtros y parámetros de búsqueda
│   ├── candidate.ts              # Datos de candidato
│   ├── testimonials.ts           # Testimonial
│   ├── blog.ts                   # Blog articles
│   ├── admin.ts                  # Tipos del panel admin
│   ├── generic.ts                # CatalogFieldsFromTypes helper type
│   └── next-auth.d.ts            # Extensión de módulos NextAuth
├── public/                       # Assets estáticos
│   └── categories/               # Imágenes de categorías del home
├── e2e/                          # Tests E2E con Playwright
│   ├── a11y.spec.ts              # Auditoría de accesibilidad (Axe + Guidepup)
│   ├── admin-smoke.spec.ts       # Smoke tests del panel admin
│   └── candidate-company-smoke.spec.ts  # Smoke tests candidatos/empresas
├── scripts/
│   ├── build-tokens.js           # Compila design-tokens.json → generated-tokens.css
│   ├── fix-react-doctor.mjs      # Correcciones de diagnóstico React
│   └── refactor-cascading.js     # Script de refactorización
├── auth.ts                       # Configuración NextAuth
├── design-tokens.json            # ⭐ ÚNICA FUENTE DE VERDAD de diseño
├── next.config.ts                # Configuración de Next.js
├── tsconfig.json                 # Configuración TypeScript
├── postcss.config.mjs            # Configuración PostCSS
├── playwright.config.ts          # Configuración Playwright
├── eslint.config.mjs             # Configuración ESLint
├── GEMINI_REFERENCES.md          # Estándares de desarrollo para agentes AI
├── A11Y_MANIFESTO.md             # Manifiesto de accesibilidad
└── copilot-context.md            # Contexto para GitHub Copilot
```

---

## 4. Sistema de Diseño (Design System)

### 4.1 Fuente de Verdad: `design-tokens.json`

El archivo `design-tokens.json` en la raíz es la **única fuente de verdad** para todos los valores de diseño. Nunca deben inventarse valores de color, tipografía o espaciado — deben provenir de este archivo.

El script `scripts/build-tokens.js` compila este archivo en `app/styles/generated-tokens.css` automáticamente antes de `npm run dev` y `npm run build` (via `predev` y `prebuild`).

### 4.2 Paleta de Colores

| Token | Variable CSS | Valor | Uso |
|---|---|---|---|
| `primary` | `--color-primary` | `#00857c` | Color principal (teal oscuro) |
| `primary-container` | `--color-primary-container` | `#26a69a` | Variante media del primario |
| `primary-light` | `--color-primary-light` | `#2abba7` | Variante clara del primario |
| `primary-deep` | `--color-primary-deep` | `#004d40` | Variante profunda del primario |
| `secondary` | `--color-secondary` | `#b02e00` | Acción secundaria (rojo terracota) |
| `secondary-container` | `--color-secondary-container` | `#fe5825` | Variante media del secundario |
| `secondary-deep` | `--color-secondary-deep` | `#9c2a0c` | Variante profunda del secundario |
| `secondary-surface` | `--color-secondary-surface` | `rgba(176,46,0,0.4)` | Superficie semitransparente |
| `background` | `--color-background` | `#f6fafe` | Fondo de la aplicación |
| `foreground` | `--color-foreground` | `#171c1f` | Texto principal |
| `card` | `--color-card` | `#ffffff` | Fondo de tarjetas |
| `surface-dark` | `--color-surface-dark` | `#004d40` | Superficie oscura |
| `surface-highlight` | `--color-surface-highlight` | `#fbfdff` | Superficie destacada |
| `surface-container-low` | `--color-surface-container-low` | `#f1f5f9` | Superficie baja |
| `functional-warning` | `--color-functional-warning` | `#f2994a` | Advertencias |
| `functional-label-star` | `--color-functional-label-star` | `#f8c51c` | Estrellas de rating |
| `brand-linkedin` | `--color-brand-linkedin` | `#2867b2` | Color de LinkedIn |
| `gray-light` | `--color-gray-light` | `rgba(23,28,31,0.2)` | Bordes y separadores |
| `gray-dark` | `--color-gray-dark` | `#697885` | Texto secundario |
| `border` | `--color-border` | `rgba(23,28,31,0.2)` | Bordes de componentes |
| `ring` | `--color-ring` | `#00857c` | Focus ring |

### 4.3 Tipografía

| Token | Variable CSS | Fuente Google | Uso |
|---|---|---|---|
| `display` | `--font-display` | Manrope | Títulos y headings |
| `body` | `--font-body` | Plus Jakarta Sans | Cuerpo de texto |
| `label` | `--font-label` | Plus Jakarta Sans | Etiquetas de formulario |
| `primary` | `--font-primary` | Plus Jakarta Sans (default) | Fuente base del body |

Las fuentes se cargan via `next/font/google` en `app/layout.tsx` con las variables CSS `--font-manrope` y `--font-plus-jakarta-sans`.

### 4.4 Radios de Borde

| Token | Variable CSS | Valor |
|---|---|---|
| `DEFAULT` | `--radius` | `0.75rem` |
| `sm` | `--radius-sm` | `calc(var(--radius) - 4px)` |
| `md` | `--radius-md` | `calc(var(--radius) - 2px)` |
| `lg` | `--radius-lg` | `var(--radius)` |
| `xl` | `--radius-xl` | `calc(var(--radius) + 4px)` |

### 4.5 Sombras

| Token | Variable CSS | Valor |
|---|---|---|
| `soft` | `--shadow-soft` | `0px 10px 30px rgba(23,28,31,0.06)` |

### 4.6 Clases CSS Globales

Definidas en `app/styles/layout/`:

#### Botones (`buttons.css`)
```css
.btn          /* Base: px-6 py-2 rounded font-semibold border-primary hover:scale-105 */
.btn-primary  /* bg-primary text-white hover:bg-primary/80 */
.btn-secondary /* bg-secondary text-white hover:bg-secondary/80 */
.btn-gray     /* bg-zinc-100 hover:bg-zinc-200 text-slate-700 */
.btn-white    /* bg-white text-black border-white */
```

> ⚠️ Para acciones primarias y secundarias, SIEMPRE usar `PremiumButton` (ver §10.1), no estas clases directamente.

#### Formularios (`forms.css`)
```css
/* Inputs, selects, textareas: border-gray-light, focus:border-primary,
   bg-[#fbfdff], h-13, rounded, px-4 py-2 */
/* Checkboxes y radios: size-5 */
```

#### Tipografía (`typography.css`)
```css
.section-title  /* text-3xl font-bold mb-10 text-center text-black uppercase */
```

### 4.7 Proceso de Compilación de Tokens

```
design-tokens.json
       ↓
scripts/build-tokens.js  (ejecuta en predev/prebuild)
       ↓
app/styles/generated-tokens.css  (NO editar manualmente)
       ↓
Importado en globals.css → @theme { ... } + :root { ... }
```

---

## 5. Arquitectura de la Aplicación

### 5.1 Patrón Islands Architecture (RSC)

La aplicación prioriza **React Server Components (RSC)** siguiendo el patrón de arquitectura de islas:

- **Por defecto:** Server Components (cero JS enviado al cliente)
- **`"use client"`** solo cuando se requiere interactividad (hooks, eventos, estado)
- Evitar prop drilling usando composición o Zustand

### 5.2 Flujo de Datos SSR

```
Request del usuario
       ↓
Next.js App Router (Server)
       ↓
auth() — verifica sesión NextAuth
       ↓
fetchApi() — obtiene datos del backend
       ↓
Render del Server Component con datos
       ↓
Hidratación en el cliente (AuthHydrator → Zustand)
```

### 5.3 Alias de Importación

```json
// tsconfig.json
"@/*" → raíz del proyecto (C:/cf/PortalEmpleoFrontEnd)
```

Ejemplo: `import { fetchApi } from "@/lib/apiClient"`

### 5.4 Variable de Entorno

```env
NEXT_PUBLIC_API=<URL del backend>
```

Esta variable se usa en `lib/apiClient.ts` como origen de todas las llamadas HTTP al backend.

---

## 6. Autenticación y Autorización

### 6.1 Middleware de Protección de Rutas (`proxy.ts`)

El archivo `proxy.ts` actúa como middleware de Next.js con protección de rutas basada en roles. Se exporta como `default` y usa el `config.matcher` para interceptar solo las rutas protegidas.

#### Reglas de acceso

| Ruta protegida | Roles permitidos |
|---|---|
| `/perfil/*` | `Postulante` |
| `/empresa-perfil/*` | `Administrador Empresa`, `Administrador de empresa` |
| `/admin/*` | Cualquier rol excepto `Postulante`, `Administrador Empresa`, `Administrador de empresa` (= `Administrador Sistema`) |

#### Comportamiento
- **Sin sesión:** Redirige a `/auth/login?next=<ruta>` para retornar después del login
- **Rol incorrecto:** Redirige a `/` (home)
- **Sin regla coincidente:** Permite el acceso (rutas públicas)
- Soporta múltiples roles via `session.user.roles[]`

### 6.2 Configuración NextAuth (`auth.ts`)

- **Provider:** `Credentials` (email + password)
- **Strategy:** JWT (`session.strategy: "jwt"`)
- **JWT maxAge:** 30 minutos
- **JWT updateAge:** 5 minutos (refresco automático)
- **Página de login:** `/auth/login`

### 6.3 Flujo de Login

```
1. Usuario → POST /auth/login
2. NextAuth Credentials.authorize()
      ↓
3. signInApi() → POST /Authorization/login
      ↓
4. Backend responde: { token, refreshToken, userId, fullName, role, ... }
      ↓
5. JWT callback almacena datos en el token de sesión
      ↓
6. Session callback expone datos al cliente
      ↓
7. AuthHydrator.tsx hidrata el store Zustand
```

### 6.4 Refresco Automático de Token

```typescript
// En auth.ts — JWT callback
// 1. Decodifica el token JWT actual
// 2. Comprueba si exp * 1000 > Date.now()
// 3. Si está vigente: retorna token sin cambios
// 4. Si expiró: llama POST /Authorization/refresh-token
```

### 6.4 Roles del Sistema

```typescript
// types/auth.ts
export const ROLES = {
  Postulante: "Postulante",
  AdministradorEmpresa: "Administrador Empresa",
  AdministradorDeEmpresa: "Administrador de empresa",
  AdministradorSistema: "Administrador Sistema",
} as const;
```

### 6.5 Sesión Extendida (next-auth.d.ts)

El módulo NextAuth se extiende para incluir:
```typescript
interface User / JWT {
  id, fullName, role, roles, email,
  accessToken, refreshToken, tokenExpireIn,
  idEmpresa?, idTipoJornadaLaboral?
}
```

### 6.6 AuthHydrator

`components/AuthHydrator.tsx` es un Server Component que recibe la sesión y datos del curriculum del root layout y los pasa al store Zustand del cliente. Garantiza que el estado global esté sincronizado con la sesión de NextAuth en cada renderizado SSR.

---

## 7. Estado Global (Zustand)

### 7.1 `useAuthStore` (`context/authStore.ts`)

Store principal que gestiona el estado de autenticación del usuario en el cliente.

#### Estado

```typescript
{
  // Identidad
  id?: string
  fullName?: string
  role?: Roles
  idCurriculum: string
  idEmpresa?: string
  profesion?: string
  pic?: string
  companyLogo?: string
  idTipoJornadaLaboral?: number

  // Autenticación
  isAuthenticated: boolean

  // Notificaciones
  unreadNotifications: number
  notifications: Notificacion[]
}
```

#### Acciones

| Acción | Descripción |
|---|---|
| `hydrate(data)` | Inicializa el store desde la sesión de NextAuth |
| `clear()` | Reinicia el estado (logout) |
| `setPic(pic)` | Actualiza la foto de perfil |
| `setCompanyLogo(logo)` | Actualiza el logo de empresa |
| `setFullName(name)` | Actualiza el nombre completo |
| `setProfesion(profesion)` | Actualiza la profesión |
| `setUnreadNotifications(count)` | Actualiza contador de no leídas |
| `setNotifications(list)` | Reemplaza la lista de notificaciones |
| `addNotification(notification)` | Agrega una notificación (dedup por ID) |
| `markNotificationRead(id)` | Marca como leída una notificación |
| `removeNotification(id)` | Elimina una notificación |

---

## 8. API Client y Capa de Datos

### 8.1 `fetchApi<T>()` — Cliente HTTP Central

```typescript
// lib/apiClient.ts
export async function fetchApi<T = PlainStringDataMessage>(
  url: string,
  options: Options = {}
): Promise<T | null>
```

**Características:**
- Agrega `Content-Type: application/json` automáticamente
- Agrega `Authorization: Bearer <token>` si se provee `token`
- Retorna `null` en caso de error o respuesta vacía (nunca lanza excepción)
- Soporta `internal: true` para llamadas internas de Next.js (sin prefijo de API)
- El `body` se serializa automáticamente con `JSON.stringify`

**Uso estándar:**
```typescript
const data = await fetchApi<MiTipo>('/endpoint', {
  method: 'POST',
  body: { clave: 'valor' },
  token: session?.user.accessToken,
});
if (!data) return null; // ← SIEMPRE verificar null
```

### 8.2 Respuesta Genérica del Backend

Todo el backend devuelve:
```typescript
type GenericResponse<T> = {
  code: number;
  messages: string[];
  isSuccess: boolean;
  data: T;
};
```

### 8.3 Módulos de `lib/`

| Módulo | Archivos | Función |
|---|---|---|
| `lib/auth/` | signin, signup | Wrappers de API para login y registro |
| `lib/jobs/` | job.ts, recent.ts, favorites.ts, role-items.ts | Vacantes: detalle, recientes, favoritos |
| `lib/company/` | profile, métodos | Perfil de empresa y operaciones |
| `lib/search/` | — | Endpoints de búsqueda de empleos/candidatos |
| `lib/user/` | info | Datos de usuario, curriculum, foto de perfil |
| `lib/catalog/` | fetch | Catálogos del sistema (ciudades, industrias, etc.) |
| `lib/testimonials/` | fetch | Listado de testimonios |
| `lib/blog/` | — | Artículos del blog |
| `lib/admin/` | — | Operaciones del panel admin |
| `lib/mocks/` | JSON files | Datos de prueba/desarrollo |

### 8.4 Utilidades en `lib/utils.ts`

| Función | Descripción |
|---|---|
| `cn(...inputs)` | Combina clases Tailwind con `clsx` + `tailwind-merge` |
| `formatDate(dateString)` | Formatea fecha en español (DD/MM/YYYY → "02 de enero de 2025") |
| `formatLongDate(iso)` | Formato largo con hora |
| `timeAgo(dateString)` | "Publicado hace X días/meses" (date-fns, locale es) |
| `getInitials(name)` | Obtiene iniciales de un nombre completo |
| `normalizeImageSrc(src)` | Normaliza URLs, base64 o rutas relativas de imágenes |
| `fileToBase64(file)` | Convierte File a string base64 |
| `validarCedulaEcuatoriana(value)` | Valida cédula ecuatoriana (10 dígitos + dígito verificador) |
| `parseWeirdDate(value)` | Parsea formato DD/MM/YYYY |
| `addSpaces(t)` | Agrega espacios en camelCase/números |
| `mapCatalogsToResponse(types, results)` | Mapea resultados de catálogos a objeto tipado |

---

## 9. Rutas y Páginas

### 9.1 Rutas Públicas

| Ruta | Descripción |
|---|---|
| `/` | Home / Landing page con categorías, beneficios y testimonios |
| `/empleos-busqueda` | Búsqueda pública de empleos con filtros |
| `/empleos-busqueda/email` | Alerta por email de resultados de búsqueda |
| `/empleos/[id]` | Detalle de una vacante |
| `/buscar-candidatos` | Landing para empresas (publicidad) |
| `/blog` | Blog de la plataforma |
| `/blog/[slug]` | Artículo individual del blog |
| `/ayuda` | Centro de ayuda |
| `/terminos` | Términos y condiciones |
| `/privacidad` | Política de privacidad |
| `/cookies` | Política de cookies |
| `/contrato` | Contrato de servicio |

### 9.2 Rutas de Autenticación

| Ruta | Descripción |
|---|---|
| `/auth/login` | Login con email y contraseña |
| `/auth/crear` | Registro de postulante |
| `/auth/email` | Registro por email (servicios/pasantías) |
| `/auth/empresa` | Registro de empresa |
| `/auth/empresa/activar` | Activación de cuenta de empresa |
| `/auth/forgot-password` | Solicitar recuperación de contraseña |
| `/auth/reset-password` | Restablecer contraseña |

### 9.3 Rutas del Postulante (requieren rol: `Postulante`)

| Ruta | Descripción |
|---|---|
| `/perfil` | Dashboard principal del postulante |
| `/perfil/editar` | Edición de datos personales, contacto, educación, experiencia, idiomas, habilidades |
| `/perfil/favoritos` | Empleos guardados como favoritos |
| `/perfil/archivos` | Gestión de CV y documentos adjuntos |
| `/perfil/cambiar-contrasena` | Cambio de contraseña |
| `/perfil/recomendaciones` | Recomendaciones recibidas/dadas |
| `/perfil/testimonios` | Testimonios del postulante |
| `/perfil/perfil-publico` | Vista previa del perfil público propio |
| `/perfil/perfil-publico/[id]` | Vista pública del perfil de otro usuario |

### 9.4 Rutas de Empresa (requieren rol: `Administrador Empresa`)

| Ruta | Descripción |
|---|---|
| `/empresa-perfil` | Dashboard de la empresa |
| `/empresa-perfil/perfil` | Información de la empresa |
| `/empresa-perfil/empleos` | Vacantes publicadas (con paginación) |
| `/empresa-perfil/empleos/[id]` | Detalle/edición de una vacante específica |
| `/empresa-perfil/crear-empleo` | Crear nueva vacante |
| `/empresa-perfil/buscar-candidatos` | Búsqueda avanzada de candidatos |
| `/empresa-perfil/candidato/[id]` | Perfil completo de un candidato |
| `/empresa-perfil/postulaciones` | Postulaciones recibidas |
| `/empresa-perfil/archivos` | Archivos de la empresa |
| `/empresa-perfil/cambiar-contrasena` | Cambio de contraseña |

### 9.5 Rutas de Administración (requieren rol: `Administrador Sistema`)

| Ruta | Descripción |
|---|---|
| `/admin` | Dashboard del sistema |
| `/admin/usuarios` | CRUD de usuarios |
| `/admin/empresas` | CRUD de empresas |
| `/admin/empleos` | Gestión global de vacantes |
| `/admin/empleos/[id]` | Detalle de una vacante en admin |
| `/admin/candidatos` | Gestión de candidatos |
| `/admin/candidatos/[id]` | Detalle de un candidato en admin |
| `/admin/catalogos` | Gestión de catálogos (tipos de documentos, industrias, etc.) |
| `/admin/roles` | Gestión de roles del sistema |
| `/admin/testimonios` | Moderación de testimonios |
| `/admin/blogs` | Gestión de artículos del blog |
| `/admin/archivos-candidato` | Archivos de candidatos |
| `/admin/archivos-empresa` | Archivos de empresas |

---

## 10. Componentes

### 10.1 Componentes Compartidos (`components/shared/components/`)

#### `PremiumButton` ⭐ — COMPONENTE OBLIGATORIO PARA ACCIONES

```typescript
import { PremiumButton } from "@/components/shared/components/PremiumButton";

// Props:
interface PremiumButtonProps {
  href?: string;                                    // Renderiza como Next.js Link
  variant?: "primary" | "secondary" | "outline" | "white";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  // + todos los atributos HTML de button
}
```

**Características:**
- Efecto de brillo (`shine`) en variantes primary/secondary via pseudo-elemento
- Soporte para estado `isLoading` con spinner animado
- `aria-disabled` y `tabIndex` manejados automáticamente
- Estilos: `rounded-full`, `uppercase`, `tracking-widest`, gradiente de `from-primary-container to-primary`

| Variante | Estilos |
|---|---|
| `primary` | Gradiente `from-primary-container to-primary`, texto blanco |
| `secondary` | Gradiente `from-secondary-container to-secondary`, texto blanco |
| `outline` | Borde `border-primary`, texto `text-primary` |
| `white` | `bg-white`, texto `text-primary` |

| Tamaño | Padding | Font Size |
|---|---|---|
| `sm` | `px-4 py-[10px]` | `text-xs` (12px) |
| `md` | `px-6 py-[10px]` | `text-sm` (14px) |
| `lg` | `px-8 py-[10px]` | `text-base` (16px) |

#### Otros Componentes Clave

| Componente | Descripción |
|---|---|
| `Navbar.tsx` | Barra de navegación responsiva con menú hamburguesa, notificaciones y avatar. Adaptable por rol (postulante/empresa/admin). |
| `Footer.tsx` | Pie de página con links, redes sociales y copyright |
| `MainLayout.tsx` | Layout principal con Navbar incluido |
| `AsideMenu.tsx` | Menú lateral para el dashboard del postulante |
| `CompanyAsideMenu.tsx` | Menú lateral para el dashboard de la empresa |
| `Testimonials.tsx` | Carrusel de testimonios con Swiper |
| `RecentJobs.tsx` | Lista de empleos recientes |
| `Filters.tsx` | Panel de filtros de búsqueda |
| `TopFilters.tsx` | Filtros en la parte superior de listados |
| `ApplicantCard.tsx` | Tarjeta de candidato en búsqueda de la empresa |
| `FavoriteButton.tsx` | Botón de guardar/quitar favorito |
| `UserAvatar.tsx` | Avatar de usuario con iniciales de fallback |
| `NotificationDropdown.tsx` | Panel desplegable de notificaciones |
| `Banner.tsx` | Banner informativo/publicitario |
| `CallToAction.tsx` | Sección de llamada a la acción |
| `Jumbo.tsx` | Sección hero/jumbotron |
| `Loader.tsx` / `LoadingState.tsx` | Estados de carga |
| `Pill.tsx` / `SkillPill.tsx` | Etiquetas de categorías/habilidades |
| `StarRating.tsx` | Componente de puntuación con estrellas |
| `StatusBadge.tsx` | Badge de estado de postulación |
| `IconBadge.tsx` | Badge con ícono |
| `SocialLinks.tsx` | Links a redes sociales (LinkedIn, GitHub, web) |
| `TablePagination.tsx` | Paginación para tablas |
| `RecomendarDialog.tsx` | Dialog para enviar recomendaciones |
| `PriceRange.tsx` | Selector de rango de salario |
| `ActionButton.tsx` | Botón de acción contextual |

### 10.2 Componentes UI (`components/ui/`)

Wrappers de Radix UI con estilos Tailwind:

| Componente | Base Radix UI |
|---|---|
| `accordion.tsx` | `@radix-ui/react-accordion` |
| `avatar.tsx` | `@radix-ui/react-avatar` |
| `button.tsx` | `class-variance-authority` + `@radix-ui/react-slot` |
| `calendar.tsx` | `react-day-picker` |
| `card.tsx` | Composición HTML |
| `checkbox.tsx` | `@radix-ui/react-checkbox` |
| `command.tsx` | `cmdk` |
| `date-picker.tsx` | Calendar + Popover |
| `dialog.tsx` | `@radix-ui/react-dialog` |
| `dropdown-menu.tsx` | `@radix-ui/react-dropdown-menu` |
| `form.tsx` | React Hook Form + `@radix-ui/react-label` |
| `input.tsx` | HTML input |
| `label.tsx` | `@radix-ui/react-label` |
| `map-picker.tsx` | `@vis.gl/react-google-maps` |
| `popover.tsx` | `@radix-ui/react-popover` |
| `scroll-area.tsx` | `@radix-ui/react-scroll-area` |
| `search-autocomplete.tsx` | Command + Popover |
| `select.tsx` | `@radix-ui/react-select` |
| `slider.tsx` | `@radix-ui/react-slider` |
| `sonner.tsx` | `sonner` (Toaster) |
| `switch.tsx` | `@radix-ui/react-switch` |
| `tabs.tsx` | `@radix-ui/react-tabs` |
| `textarea.tsx` | HTML textarea |
| `tooltip.tsx` | `@radix-ui/react-tooltip` |

### 10.3 Política de Reutilización de Componentes

1. **Buscar en workspace** (`@/components/shared/components`) → reutilizar si existe
2. **Buscar en librerías instaladas** (Radix UI para lógica, Lucide para íconos)
3. **Crear nuevo** solo si no existe — ubicar en `@/components/shared/components/`, seguir tokens del `design-tokens.json`, usar `cn()` para clases

---

## 11. Tipos TypeScript

### 11.1 Tipos Principales

#### `types/auth.ts`
```typescript
ROLES = { Postulante, AdministradorEmpresa, AdministradorDeEmpresa, AdministradorSistema }
type Roles = KnownRole | (string & {})  // Permite roles custom
```

#### `types/user.ts`
- `GenericResponse<T>` — Envoltorio estándar de respuestas del backend
- `LoginData` — Datos retornados en login (token, refreshToken, rol, etc.)
- `UserInfoData` — Perfil completo del usuario (personal, contacto, educación, experiencia, habilidades, idiomas)
- `DatosPersonales`, `DatosContacto`, `Educacion`, `ExperienciaLaboral`, `Habilidades`, `Idioma`
- `Curriculum` — Resumen profesional y disponibilidad
- `DashboardInfoData` — Métricas del dashboard del postulante
- `Notificacion` — Notificación del sistema

#### `types/jobs.ts`
- `Job` — Vacante completa
- `Jobs` — Lista paginada de vacantes
- `RecentJob` — Vacante resumida para listados

#### `types/company.ts`
- `CompanyProfileData` — Perfil completo de empresa
- `CompanySignUpData` — Datos de registro de empresa
- `CompanyDashboardInfoData` — Métricas del dashboard empresarial
- `OfertaEmpleo` — Oferta de empleo con estado
- `PostulacionItem` — Postulación con datos del candidato
- `CandidateSearchResult` / `SearchCandidatesRequest` — Búsqueda avanzada de candidatos
- `UsuarioAdministrador` — Admin de empresa

#### `types/search.ts`
- Filtros y parámetros de búsqueda de empleos

#### `types/generic.ts`
- `CatalogFieldsFromTypes` — Helper de inferencia de tipos para catálogos

### 11.2 Convenciones de Tipos

- Usar `interface` para objetos de datos
- Usar `type` para uniones, intersecciones y aliases
- Todos los datos externos validados con **Zod**
- `noImplicitAny: true` — TypeScript estricto
- Los catálogos usan `as const satisfies readonly CatalogTypes[]` para type safety

---

## 12. Testing y Accesibilidad

### 12.1 Estrategia de Testing E2E (Playwright)

```typescript
// playwright.config.ts
{
  testDir: "./e2e",
  fullyParallel: false,  // Necesario para screen readers
  workers: 1,            // Obligatorio para Guidepup
  headless: false,       // Obligatorio para Guidepup
  baseURL: "http://localhost:3000"
}
```

### 12.2 Suites de Tests

| Archivo | Descripción |
|---|---|
| `e2e/a11y.spec.ts` | Auditoría Axe-core (WCAG 2.1 AA) + simulación NVDA/Guidepup |
| `e2e/admin-smoke.spec.ts` | Smoke tests del panel admin |
| `e2e/candidate-company-smoke.spec.ts` | Smoke tests del flujo candidato/empresa |

### 12.3 Estándar de Accesibilidad (WCAG 2.1 AA)

La accesibilidad es **no negociable** en este proyecto:

#### ✅ Requisitos obligatorios
- Usar `<button>` para acciones, `<a>` para navegación
- Botones solo con ícono DEBEN tener `aria-label`
- Todo input de formulario debe tener `<label>` asociado
- `focus:ring-2 focus:ring-primary` en todos los elementos interactivos
- Contraste mínimo de `4.5:1` para texto normal (WCAG 1.4.3)

#### Hallazgos del Audit (histórico)
- Color `primary` anterior tenía contraste `2.88:1` → corregido a `#00857c`
- Texto `gray-dark` tenía contraste `4.11:1` → corregido a `#697885`

#### Ejecución del test de accesibilidad
```bash
npm run test:a11y
```
> Requiere build de producción corriendo en `localhost:3000`

### 12.4 Navegación por Teclado

La simulación con Guidepup/NVDA verifica que al hacer `Tab` se anuncien textos significativos:
- ✅ `"Navigation landmark, toggle button, Abrir menú"`
- ✅ `"Crear cuenta, link"`
- ✅ `"Ingresar, link"`

---

## 13. Scripts y Herramientas

### 13.1 Scripts de `package.json`

```bash
npm run dev         # predev (build-tokens) → next dev
npm run build       # prebuild (build-tokens) → next build
npm run start       # next start
npm run lint        # eslint
npm run test:a11y   # playwright test e2e/a11y.spec.ts
```

### 13.2 `scripts/build-tokens.js`

Convierte `design-tokens.json` en `app/styles/generated-tokens.css` con:
- Bloque `@theme { }` para utilidades Tailwind CSS 4
- Bloque `:root { }` para variables CSS nativas

Se ejecuta automáticamente antes de `dev` y `build`.

### 13.3 `proxy.ts`

Proxy local para redirigir llamadas de API durante desarrollo (evita problemas de CORS).

### 13.4 `lib/hooks.tsx`

Custom hooks del proyecto:
- `useDebouncedValue` — Debounce para campos de búsqueda

---

## 14. Estándares de Desarrollo

### 14.1 ⛔ Design Freeze (UI FREEZE)

**CRÍTICO:** El look and feel está congelado. Está prohibido modificar:
- Sistema de diseño, colores, espaciado
- Animaciones CSS o estructuras de layout
- Combinaciones de utilidades Tailwind

**Solo se puede cambiar el diseño si el usuario lo solicita explícitamente.**

### 14.2 Reglas de CSS y Layouts

- **Macro-layouts:** CSS Grid
- **Micro-layouts:** Flexbox
- **Sin estilos inline** (`style={{ ... }}`): Usar exclusivamente Tailwind CSS
  - Excepción: valores dinámicos de API imposibles de lograr con Tailwind (requiere aprobación explícita)
- **Zero runtime:** Sin interpolación dinámica de strings en clases (`bg-${color}-500` → usar map de clases completas)
- **Mobile first:** Estilos base → `md:` → `lg:`
- **Siempre `cn()`** para clases condicionales

### 14.3 Convenciones de Código

```typescript
// ✅ Server Component (por defecto)
export default async function MiPagina() {
  const datos = await fetchApi<MiTipo>('/endpoint');
  return <MiComponente datos={datos} />;
}

// ✅ Client Component (solo cuando necesario)
"use client";
export default function MiFormulario() {
  const { register, handleSubmit } = useForm();
  // ...
}

// ✅ Composición de clases
className={cn("base-class", isActive && "active-class", className)}

// ✅ Validación con Zod
const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
});
```

### 14.4 Formularios

Patrón obligatorio: **React Hook Form + Zod**

```typescript
// 1. Definir schema en lib/[domain]/schema.ts
export const miFormSchema = z.object({
  campo: z.string().min(1, "Campo obligatorio"),
});

// 2. Usar en componente
const form = useForm<z.infer<typeof miFormSchema>>({
  resolver: zodResolver(miFormSchema),
});
```

### 14.5 SEO

Cada página debe tener:
```typescript
export const metadata: Metadata = {
  title: "Título de la Página | Implica",
  description: "Descripción para motores de búsqueda",
};
```

### 14.6 Herramientas de Código

- **ESLint:** `eslint-config-next` + `eslint-plugin-jsx-a11y`
- **TypeScript:** Modo estricto (`noImplicitAny: true`)
- **Linting de accesibilidad:** `eslint-plugin-jsx-a11y` en tiempo de desarrollo

---

## 15. Flujos de Usuario

### 15.1 Flujo del Postulante

```
Landing (/) → Selecciona "Buscar empleo"
    ↓
/auth/crear (registro) o /auth/login
    ↓
/perfil (dashboard)
    ├── Ver estadísticas (postulaciones, revisiones, visitas)
    ├── Completar perfil → /perfil/editar
    │     ├── Datos personales
    │     ├── Educación
    │     ├── Experiencia laboral
    │     ├── Habilidades
    │     └── Idiomas
    ├── Buscar empleos → /empleos-busqueda
    │     ├── Filtros (ciudad, modalidad, salario, categoría)
    │     └── Ver detalle → /empleos/[id] → Postularse
    ├── Ver favoritos → /perfil/favoritos
    └── Ver recomendaciones → /perfil/recomendaciones
```

### 15.2 Flujo de la Empresa

```
Landing (/) → Selecciona "Buscar talento"
    ↓
/auth/empresa (registro empresa)
    ↓
/empresa-perfil (dashboard)
    ├── Ver métricas (vacantes, candidatos, postulaciones)
    ├── Gestionar perfil → /empresa-perfil/perfil
    ├── Publicar vacante → /empresa-perfil/crear-empleo
    ├── Gestionar vacantes → /empresa-perfil/empleos
    ├── Buscar candidatos → /empresa-perfil/buscar-candidatos
    │     └── Ver candidato → /empresa-perfil/candidato/[id]
    └── Ver postulaciones → /empresa-perfil/postulaciones
```

### 15.3 Flujo del Administrador de Sistema

```
/auth/login → Detecta rol AdministradorSistema → /admin
    ├── Gestión de usuarios
    ├── Gestión de empresas
    ├── Gestión de empleos
    ├── Gestión de catálogos
    ├── Moderación de testimonios/blogs
    └── Gestión de archivos
```

---

## 16. Notificaciones en Tiempo Real

### 16.1 Tecnología: Microsoft SignalR (`@microsoft/signalr`)

El cliente `components/NotificationRealtimeClient.tsx` establece una conexión WebSocket persistente con el backend usando SignalR:

```typescript
// Conexión al hub de notificaciones
const connection = new HubConnectionBuilder()
  .withUrl(`${NEXT_PUBLIC_API}/hubs/notifications`, {
    accessTokenFactory: () => session.user.accessToken,
  })
  .withAutomaticReconnect()
  .configureLogging(LogLevel.Warning)
  .build();

// Escucha el evento "notification:new"
connection.on("notification:new", (notification: Notificacion) => {
  addNotification(notification);   // → Zustand store
  toast.info(notification.descripcion);  // → Sonner toast
});
```

### 16.2 Flujo de Notificaciones

```
Backend emite "notification:new"
    ↓
SignalR → NotificationRealtimeClient
    ↓
useAuthStore.addNotification()  (dedup por idNotificacion)
    ↓
NotificationDropdown muestra el contador y la lista
    ↓
Sonner toast bottom-right (inmediato)
```

### 16.3 Estado de Notificaciones en Zustand

- `notifications: Notificacion[]` — Lista completa
- `unreadNotifications: number` — Calculado como `notifications.filter(n => !n.esLeida).length`
- Las notificaciones se muestran en `NotificationDropdown.tsx` en el `Navbar`

---

## Referencias Adicionales

| Archivo | Propósito |
|---|---|
| `design-tokens.json` | Fuente de verdad del sistema de diseño |
| `GEMINI_REFERENCES.md` | Estándares completos para agentes AI |
| `A11Y_MANIFESTO.md` | Manifiesto y procedimientos de accesibilidad |
| `copilot-context.md` | Contexto para GitHub Copilot |
| `.cursorrules` | Reglas estrictas de UI para el editor |

---

*Última actualización: Mayo 2026 — Branch: `RB/companyMethods`*
