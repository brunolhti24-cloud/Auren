/* ==========================================================
   CARRUSEL DE TESTIMONIOS
   Los datos vienen de js/data/testimonials.js
   ========================================================== */
import { TESTIMONIALS } from "../data/testimonials.js";
import { CONFIG } from "../config.js";
import { escapeHTML, initials, onSwipe, prefersReducedMotion } from "./utils.js";

function testimonialTemplate(t, i) {
  const avatar = t.avatar
    ? `<img src="${escapeHTML(t.avatar)}" alt="" />`
    : escapeHTML(initials(t.name));

  return `
    <figure class="testimonial" data-index="${i}" aria-hidden="true">
      <span class="testimonial__quote-mark" aria-hidden="true">“</span>
      <blockquote class="testimonial__text">“${escapeHTML(t.quote)}”</blockquote>
      <figcaption class="testimonial__author">
        <span class="testimonial__avatar">${avatar}</span>
        <span>
          <span class="testimonial__name">${escapeHTML(t.name)}</span><br />
          <span class="testimonial__role">${escapeHTML(t.role)}</span>
        </span>
      </figcaption>
    </figure>`;
}

export function initTestimonials() {
  const root = document.getElementById("testimonials");
  if (!root || !TESTIMONIALS.length) return;

  const viewport = root.querySelector(".testimonials__viewport");
  const dotsBox = root.querySelector("[data-testimonial-dots]");
  const prev = root.querySelector("[data-testimonial-prev]");
  const next = root.querySelector("[data-testimonial-next]");

  viewport.innerHTML = TESTIMONIALS.map(testimonialTemplate).join("");
  dotsBox.innerHTML = TESTIMONIALS.map(
    (_, i) => `<button class="slider__dot" type="button" data-index="${i}" aria-label="Testimonio ${i + 1}"></button>`
  ).join("");

  const slides = [...viewport.children];
  const dots = [...dotsBox.children];
  let current = 0;
  let timer = null;

  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => {
      const active = idx === current;
      s.classList.toggle("is-active", active);
      s.setAttribute("aria-hidden", String(!active));
    });
    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === current));
  }

  function startAutoplay() {
    if (!CONFIG.TESTIMONIALS_AUTOPLAY || prefersReducedMotion()) return;
    stopAutoplay();
    timer = setInterval(() => show(current + 1), CONFIG.TESTIMONIALS_AUTOPLAY);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  prev.addEventListener("click", () => { show(current - 1); startAutoplay(); });
  next.addEventListener("click", () => { show(current + 1); startAutoplay(); });
  dotsBox.addEventListener("click", (e) => {
    const dot = e.target.closest(".slider__dot");
    if (dot) { show(Number(dot.dataset.index)); startAutoplay(); }
  });

  onSwipe(viewport, { onLeft: () => show(current + 1), onRight: () => show(current - 1) });

  root.addEventListener("mouseenter", stopAutoplay);
  root.addEventListener("mouseleave", startAutoplay);
  root.addEventListener("focusin", stopAutoplay);

  show(0);
  startAutoplay();
}
