# AUREN — Sitio web

Sitio web de AUREN (Desarrollo Web Full Stack) hecho con **HTML, CSS y TypeScript** (sin frameworks, compilado con [Vite](https://vitejs.dev)), responsivo y organizado por módulos.

## Cómo trabajar en él

Necesitas [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install        # solo la primera vez
npm run dev        # servidor local con recarga automática (http://localhost:5173)
npm run typecheck  # revisa los tipos de TypeScript
npm run build      # genera el sitio final en dist/
npm run preview    # sirve dist/ para probar el build
```

> ⚠️ El navegador no entiende TypeScript directamente: abre siempre el sitio con `npm run dev` (no con doble clic sobre `index.html` ni con Live Server).

## Estructura

```
auren-web/
├── index.html                 ← Estructura de la página y del wizard
├── assets/
│   ├── icons/favicon.svg
│   └── img/
│       ├── logo-mark.svg      ← Logo (la "A")
│       └── projects/          ← Imágenes de los proyectos (reemplázalas por capturas reales)
├── css/
│   ├── main.css               ← Solo importa los demás archivos
│   ├── base/                  ← variables (colores, fuentes), reset, tipografía, utilidades
│   ├── layout/                ← header y footer
│   ├── components/            ← botones, tarjetas, slider, formularios, wizard
│   └── sections/              ← un archivo por sección de la página
├── src/
│   ├── main.ts                ← Punto de entrada: inicializa los módulos
│   ├── config.ts              ← Ajustes (a dónde se envía la cotización, autoplay)
│   ├── types.ts               ← Tipos compartidos (Project, Testimonial, opciones del wizard…)
│   ├── data/                  ← CONTENIDO editable: proyectos, testimonios, opciones del wizard
│   └── modules/               ← Lógica: navbar, slider, testimonios, wizard, iconos, animaciones
├── package.json               ← Scripts (dev, build…) y dependencias
├── tsconfig.json              ← Configuración de TypeScript (modo estricto)
└── vite.config.ts             ← Configuración de Vite
```

## Tareas comunes

| Quiero…                                   | Edita                                   |
|-------------------------------------------|-----------------------------------------|
| Cambiar colores o fuentes                 | `css/base/variables.css`                |
| Agregar/quitar un proyecto                | `src/data/projects.ts` (importa la imagen arriba) |
| Agregar/quitar un testimonio              | `src/data/testimonials.ts`               |
| Cambiar opciones del wizard               | `src/data/wizard-options.ts`             |
| Recibir las cotizaciones por correo       | `src/config.ts` → `FORM_ENDPOINT`       |
| Usar un icono nuevo                       | `src/modules/icons.ts` y `<i data-icon="nombre"></i>` |

## Wizard "Cotizar proyecto"

Cualquier botón con el atributo `data-open-wizard` abre el asistente. Si le das un valor, preselecciona el tipo de proyecto:

```html
<button data-open-wizard>Cotizar</button>                <!-- sin preselección -->
<button data-open-wizard="ecommerce">Mi tienda</button>  <!-- web | ecommerce | system | other -->
```

Pasos: **1. Proyecto → 2. Detalles → 3. Información → 4. Envío** (resumen + confirmación).
Cada paso se valida antes de avanzar. En el resumen hay botones "Editar" para volver a cualquier paso.

### Recibir las solicitudes

Por defecto el envío es **simulado** (la información aparece en la consola del navegador). Para recibirlas en tu correo:

1. Crea un formulario gratis en [formspree.io](https://formspree.io).
2. Copia tu URL (ej. `https://formspree.io/f/abcd1234`) en `src/config.ts`:
   ```ts
   FORM_ENDPOINT: "https://formspree.io/f/abcd1234",
   ```

## Publicarlo

Ejecuta `npm run build` y sube el contenido de la carpeta **`dist/`** a **Netlify**, **Vercel** o **GitHub Pages** (las rutas son relativas, funciona en cualquier subcarpeta).

En Netlify/Vercel también puedes conectar el repositorio con: comando de build `npm run build` y carpeta de publicación `dist`.
