/* ==========================================================
   OPCIONES DEL WIZARD DE COTIZACIÓN
   Edita aquí los tipos de proyecto, funcionalidades,
   presupuestos y plazos sin tocar la lógica.
   ========================================================== */

/* Paso 1 — Tipo de proyecto */
export const PROJECT_TYPES = [
  { id: "web", icon: "laptop", title: "Sitio web corporativo", text: "Presencia profesional para tu negocio" },
  { id: "ecommerce", icon: "cart", title: "Tienda en línea", text: "Vende tus productos en internet" },
  { id: "system", icon: "layers", title: "Sistema web a medida", text: "Una solución personalizada para tus procesos" },
  { id: "other", icon: "code", title: "Otro", text: "Cuéntanos tu idea" },
];

/* Paso 2 — Funcionalidades */
export const FEATURES = [
  { id: "reservations", icon: "calendar", label: "Reservaciones" },
  { id: "payments", icon: "credit-card", label: "Pagos en línea" },
  { id: "catalog", icon: "package", label: "Catálogo de productos" },
  { id: "admin", icon: "dashboard", label: "Panel administrativo" },
  { id: "users", icon: "user", label: "Registro de usuarios" },
  { id: "blog", icon: "file-text", label: "Blog / noticias" },
  { id: "multilang", icon: "globe", label: "Varios idiomas" },
  { id: "integrations", icon: "plug", label: "Integraciones / API" },
  { id: "seo", icon: "search", label: "SEO y analítica" },
  { id: "chat", icon: "message", label: "WhatsApp / chat" },
  { id: "unsure", icon: "star", label: "No estoy seguro, asesórenme" },
];

/* Paso 2 — Presupuesto (MXN) */
export const BUDGETS = [
  { value: "", label: "Selecciona una opción" },
  { value: "<15k", label: "Menos de $15,000" },
  { value: "15k-40k", label: "$15,000 – $40,000" },
  { value: "40k-80k", label: "$40,000 – $80,000" },
  { value: ">80k", label: "Más de $80,000" },
  { value: "unknown", label: "Aún no lo sé" },
];

/* Paso 2 — Plazo */
export const TIMELINES = [
  { value: "", label: "Selecciona una opción" },
  { value: "asap", label: "Lo antes posible" },
  { value: "1m", label: "En 1 mes" },
  { value: "1-3m", label: "De 1 a 3 meses" },
  { value: "flexible", label: "Soy flexible" },
];
