/* ==========================================================
   NAVBAR: menú móvil, fondo al hacer scroll y enlace activo
   ========================================================== */
export function initNavbar() {
  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("nav-toggle");
  const links = [...document.querySelectorAll(".nav__link")];

  if (!header || !nav || !toggle) return;

  /* Menú móvil */
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };

  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));

  // Cierra el menú al elegir una opción
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  /* Fondo del header al hacer scroll */
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Resalta el enlace de la sección visible */
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}
