# refriApp — Plan

App mobile-first para llevar registro de productos en el refri/super. Cada producto tiene una etiqueta QR pegada físicamente; al agregar uno nuevo a la lista hay que escanear el QR (o, como alternativa secundaria, ingresar el ID manualmente).

## Inspiración de diseño

Referencia: `~/Desktop/Captura de pantalla 2026-05-01 a la(s) 14.32.21.png` (dashboard mobile estilo "neumórfico claro / glassmorphism").

Elementos a tomar prestados:

- **Fondo claro** con leve degradado lila/azul muy desaturado.
- **Cards grandes con bordes redondeados** (radius ~24px) y sombras suaves difusas (no nítidas).
- **Acentos de color por categoría** en las cards (rosa, lila, azul, verde menta), cada categoría con su color asignado en `src/config/categories.ts`.
- **Header simple**: saludo grande + ícono de búsqueda y menú a la derecha.
- **Tira horizontal de filtros tipo "días de la semana"** → la reutilizamos como **selector de categoría** scrollable horizontal con la activa pill rellena.
- **Sección "Recent" / lista vertical** con cards más chicas: ícono circular de color a la izquierda, título y subtítulo a la derecha, chevron al final. Esto es el **listado de productos**.
- **Bottom nav flotante** con fondo blanco, esquinas redondeadas y un **FAB central** elevado (será el "+" para agregar producto / abrir escáner).
- **Tipografía** sans-serif geométrica, pesos 400/600/700, jerarquía clara con tamaños grandes para títulos.

Paleta tentativa (a fijar en `src/config/theme.ts`):

- Fondo: `#F4F5FB`
- Card base: `#FFFFFF`
- Texto primario: `#1A1B2E`
- Texto secundario: `#8A8DA8`
- Acentos categorías: rosa `#FF7BA9`, lila `#A78BFA`, azul `#7DB9FF`, menta `#7DD3C0`, durazno `#FFB68A`, amarillo `#FFD66B`, gris `#C9CBD9`.

## Stack

- **Vite + React + TypeScript**
- **CSS Modules** (mobile-first, sin framework)
- **Persistencia:** `localStorage` (sin backend)
- **Estado global:** Context API + hook `useProducts`
- **QR generación:** `qrcode.react`
- **QR escaneo:** `html5-qrcode` (cámara web/mobile, requiere HTTPS o localhost)

## Reglas de producto

- Toda la info (textos, categorías, formatos, longitud de ID) vive en `src/config/`. **Nada hardcodeado** en componentes.
- Componentización estricta: cada pieza visual reutilizable es su propio componente con su `.module.css`.
- Mobile-first: layouts pensados para 360px en adelante; desktop es secundario.

## Modelo de datos

```ts
type Product = {
  id: string;          // viene del QR escaneado o ingresado manualmente
  name: string;
  category: string;    // valor de src/config/categories.ts
  entryDate: string;   // ISO yyyy-mm-dd
  description: string;
  createdAt: string;   // ISO timestamp
};
```

## Flujo: agregar producto

1. Botón flotante "+" abre la pantalla "Nuevo producto".
2. Por defecto se abre el **escáner QR** (cámara activa).
3. Debajo, un **botón pequeño "Ingresar ID manual"** como alternativa secundaria.
4. Una vez capturado el ID:
   - Si ya existe → ofrecer abrir/editar ese producto.
   - Si no existe → mostrar el form (nombre, categoría, fecha = hoy por default, descripción).
5. Guardar → vuelve al listado.

## Flujo: ver/editar/borrar

- Listado: cards con el ID destacado, nombre, categoría, fecha de ingreso.
- Tap en una card → detalle con todos los campos + QR generado (para reimprimir si hace falta).
- Botón editar y botón borrar dentro del detalle.

## Categorías (configurables en `src/config/categories.ts`)

- Lácteos
- Verduras
- Frutas
- Carnes
- Bebidas
- Congelados
- Otros

## Estructura de carpetas

```
src/
  config/
    constants.ts        ← textos UI, formatos
    categories.ts       ← lista de categorías
  context/
    ProductsContext.tsx ← estado global + persistencia
  hooks/
    useProducts.ts      ← add, edit, delete, findById
    useQrScanner.ts     ← wrapper de html5-qrcode
  components/
    ProductList/
    ProductCard/
    ProductForm/        ← reutilizable crear/editar
    ProductDetail/      ← muestra QR generado
    QrScanner/          ← cámara + botón "ID manual" abajo
    Modal/
    Button/
    Input/
    Select/
  utils/
    storage.ts          ← read/write localStorage tipado
    date.ts             ← formato fecha
    validation.ts       ← validar ID único, campos requeridos
  types/
    product.ts
  App.tsx
  main.tsx
```

## Decisiones cerradas

| Tema             | Decisión                                                  |
| ---------------- | --------------------------------------------------------- |
| Lenguaje         | TypeScript                                                |
| Estilos          | CSS Modules                                               |
| ID               | Ingresado vía QR (primario) o manual (secundario)         |
| Categorías       | Sí, configurables en `src/config/categories.ts`           |
| Persistencia     | `localStorage` (fase 1)                                   |
| Carpeta proyecto | `refriApp/` (raíz, sin desanidar)                         |

## Pendientes / fase 2

- Búsqueda y filtro (por nombre, categoría, ID).
- Orden por fecha de ingreso / vencimiento.
- Campo opcional `expiryDate` con alerta visual cuando se acerca.
- Sync entre dispositivos (Supabase/Firebase) si se necesita.
- Exportar/importar JSON.

## Pasos de implementación (cuando se apruebe el plan)

1. ✅ `src/types/product.ts` y `src/config/` (constants, categories, theme).
2. ✅ `utils/storage.ts` + `context/ProductsContext.tsx` + `hooks/useProducts.ts`.
3. ✅ Componentes base: `Button`, `Input`, `Select`, `Modal`.
4. ✅ `ProductList` + `ProductCard` con datos del context.
5. ✅ `ProductForm` y wiring de crear/editar.
6. ✅ `QrScanner` con `html5-qrcode` + fallback "ID manual".
7. ✅ `ProductDetail` con QR generado vía `qrcode.react`.
8. ✅ Pulido mobile (viewport, safe areas, botón flotante).
