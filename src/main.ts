/* ==========================================================
   AUREN — Punto de entrada de JavaScript
   Cada funcionalidad vive en su propio módulo dentro de /modules.
   ========================================================== */
import { renderIcons } from "./modules/icons";
import { initNavbar } from "./modules/navbar";
import { initReveal } from "./modules/reveal";
import { initProjectsSlider } from "./modules/projects-slider";
import { initTestimonials } from "./modules/testimonials";
import { initWizard } from "./modules/wizard";

document.documentElement.classList.remove("no-js");

// El orden importa: primero se generan los contenidos, luego los iconos.
initProjectsSlider();
initTestimonials();
initWizard();
renderIcons();
initNavbar();
initReveal();

// Año actual en el footer
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
