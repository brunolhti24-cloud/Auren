/* ==========================================================
   SLIDER DE PROYECTOS
   Los datos vienen de js/data/projects.js
   ========================================================== */
import { PROJECTS } from "../data/projects.js";
import { escapeHTML, onSwipe } from "./utils.js";

function projectTemplate(project) {
  return `
    <li class="slider__slide">
      <a class="project-card" href="${escapeHTML(project.url)}">
        <div class="project-card__media">
          <img src="${escapeHTML(project.image)}" alt="Vista previa de ${escapeHTML(project.title)}" loading="lazy" />
        </div>
        <h3 class="project-card__title">${escapeHTML(project.title)}</h3>
        <p class="project-card__text">${escapeHTML(project.description)}</p>
      </a>
    </li>`;
}

export function initProjectsSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const track = slider.querySelector("[data-slider-track]");
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  const dotsBox = slider.querySelector("[data-slider-dots]");

  track.innerHTML = PROJECTS.map(projectTemplate).join("");

  let index = 0;

  const perView = () => parseInt(getComputedStyle(slider).getPropertyValue("--per-view"), 10) || 1;
  const maxIndex = () => Math.max(0, PROJECTS.length - perView());

  function renderDots() {
    const total = maxIndex() + 1;
    dotsBox.innerHTML = Array.from(
      { length: total },
      (_, i) => `<button class="slider__dot" type="button" data-index="${i}" aria-label="Ir al grupo ${i + 1}"></button>`
    ).join("");
    dotsBox.hidden = total <= 1;
  }

  function update() {
    index = Math.min(Math.max(index, 0), maxIndex());
    const slide = track.children[0];
    if (!slide) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.style.transform = `translateX(${-index * (slide.offsetWidth + gap)}px)`;

    prev.disabled = index === 0;
    next.disabled = index === maxIndex();
    dotsBox.querySelectorAll(".slider__dot").forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-current", i === index ? "true" : "false");
    });
  }

  const goTo = (i) => {
    index = i;
    update();
  };

  prev.addEventListener("click", () => goTo(index - 1));
  next.addEventListener("click", () => goTo(index + 1));
  dotsBox.addEventListener("click", (e) => {
    const dot = e.target.closest(".slider__dot");
    if (dot) goTo(Number(dot.dataset.index));
  });

  onSwipe(track, { onLeft: () => goTo(index + 1), onRight: () => goTo(index - 1) });

  // Recalcula al cambiar el tamaño de pantalla
  let lastPerView = perView();
  new ResizeObserver(() => {
    if (perView() !== lastPerView) {
      lastPerView = perView();
      renderDots();
    }
    update();
  }).observe(slider);

  renderDots();
  update();
}
