/* ==========================================================
   ANIMACIÓN DE APARICIÓN AL HACER SCROLL
   Agrega la clase "reveal" a cualquier elemento para animarlo.
   ========================================================== */
export function initReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => {
    // Pequeño retraso escalonado entre elementos hermanos
    const siblings = [...(el.parentElement?.children ?? [])].filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
    observer.observe(el);
  });
}
