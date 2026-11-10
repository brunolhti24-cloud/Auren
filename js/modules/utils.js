/* ==========================================================
   UTILIDADES COMPARTIDAS
   ========================================================== */

/** Escapa texto para insertarlo de forma segura en HTML. */
export function escapeHTML(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Devuelve las iniciales de un nombre ("Carlos M." -> "CM"). */
export function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

/** Detecta si el usuario prefiere menos movimiento. */
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Agrega gestos de deslizamiento (swipe) a un elemento. */
export function onSwipe(element, { onLeft, onRight, threshold = 45 }) {
  let startX = 0;
  let startY = 0;

  element.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
  });

  element.addEventListener("pointerup", (e) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy)) return;
    dx < 0 ? onLeft?.() : onRight?.();
  });
}
