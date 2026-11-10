/* ==========================================================
   UTILIDADES COMPARTIDAS
   ========================================================== */

/** Escapa texto para insertarlo de forma segura en HTML. */
export function escapeHTML(value: unknown = ""): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Devuelve las iniciales de un nombre ("Carlos M." -> "CM"). */
export function initials(name = ""): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/** Detecta si el usuario prefiere menos movimiento. */
export const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Agrega gestos de deslizamiento (swipe) a un elemento. */
export interface SwipeOptions {
  onLeft?: () => void;
  onRight?: () => void;
  /** Distancia mínima en píxeles para contar como swipe. */
  threshold?: number;
}

export function onSwipe(element: HTMLElement, { onLeft, onRight, threshold = 45 }: SwipeOptions): void {
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
    if (dx < 0) onLeft?.();
    else onRight?.();
  });
}

/**
 * querySelector que exige que el elemento exista.
 * Lanza un error claro si falta en el HTML (en lugar de fallar más adelante con `null`).
 */
export function qs<T extends Element = HTMLElement>(root: ParentNode, selector: string): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`[auren] No se encontró el elemento "${selector}" en el HTML.`);
  return el;
}

/** Devuelve el elemento más cercano (desde el target de un evento) que coincida con el selector. */
export function closestFromEvent<T extends Element = HTMLElement>(e: Event, selector: string): T | null {
  return e.target instanceof Element ? e.target.closest<T>(selector) : null;
}
