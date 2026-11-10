/* ==========================================================
   TESTIMONIOS — agrega, quita o edita testimonios aquí.
   `avatar` es opcional (ruta a una foto). Si no hay, se usan iniciales.
   ========================================================== */
import type { Testimonial } from "../types";

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "El equipo de AUREN entendió perfectamente lo que necesitábamos. Nuestro sistema de pedidos nos ha ayudado a ahorrar tiempo y mejorar la experiencia de nuestros clientes.",
    name: "Carlos M.",
    role: "Propietario de Restaurante",
    avatar: "",
  },
  {
    quote:
      "Nuestra tienda en línea quedó rápida y muy fácil de administrar. Desde el lanzamiento, las ventas por internet ya representan una parte importante del negocio.",
    name: "Laura G.",
    role: "Fundadora de tienda ecológica",
    avatar: "",
  },
  {
    quote:
      "Comunicación clara en todo momento y entregas a tiempo. El nuevo sitio corporativo transmite la seriedad que buscábamos.",
    name: "Ricardo P.",
    role: "Director Comercial, sector industrial",
    avatar: "",
  },
];
