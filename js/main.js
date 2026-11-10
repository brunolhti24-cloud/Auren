/* ==========================================================
   AUREN — Punto de entrada de JavaScript
   Cada funcionalidad vive en su propio módulo dentro de /modules.
   ========================================================== */
import { renderIcons } from "./modules/icons.js";
import { initNavbar } from "./modules/navbar.js";
import { initReveal } from "./modules/reveal.js";
import { initProjectsSlider } from "./modules/projects-slider.js";
import { initTestimonials } from "./modules/testimonials.js";
import { initWizard } from "./modules/wizard.js";

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
if (year) year.textContent = new Date().getFullYear();
