# AUREN — Sitio web

Sitio web de AUREN (Desarrollo Web Full Stack) hecho con **HTML, CSS y JavaScript puros** (sin frameworks), responsivo y organizado por módulos.

## Cómo abrirlo en VS Code

1. Descomprime la carpeta y ábrela en VS Code (`Archivo → Abrir carpeta…`).
2. Instala la extensión **Live Server** (VS Code te la sugerirá automáticamente).
3. Clic derecho sobre `index.html` → **Open with Live Server**.

> ⚠️ El JavaScript usa *módulos ES* (`import/export`), así que **no funciona abriendo `index.html` con doble clic** (`file://`). Siempre usa Live Server o cualquier servidor local.

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
└── js/
    ├── main.js                ← Punto de entrada: inicializa los módulos
    ├── config.js              ← Ajustes (a dónde se envía la cotización, autoplay)
    ├── data/                  ← CONTENIDO editable: proyectos, testimonios, opciones del wizard
    └── modules/               ← Lógica: navbar, slider, testimonios, wizard, iconos, animaciones
```

## Tareas comunes

| Quiero…                                   | Edita                                   |
|-------------------------------------------|-----------------------------------------|
| Cambiar colores o fuentes                 | `css/base/variables.css`                |
| Agregar/quitar un proyecto                | `js/data/projects.js`                   |
| Agregar/quitar un testimonio              | `js/data/testimonials.js`               |
| Cambiar opciones del wizard               | `js/data/wizard-options.js`             |
| Recibir las cotizaciones por correo       | `js/config.js` → `FORM_ENDPOINT`        |
| Usar un icono nuevo                       | `js/modules/icons.js` y `<i data-icon="nombre"></i>` |

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
2. Copia tu URL (ej. `https://formspree.io/f/abcd1234`) en `js/config.js`:
   ```js
   FORM_ENDPOINT: "https://formspree.io/f/abcd1234",
   ```

## Publicarlo

Es un sitio estático: puedes subir la carpeta tal cual a **Netlify**, **Vercel** o **GitHub Pages**.
