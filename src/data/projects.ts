/* ==========================================================
   PROYECTOS — agrega, quita o edita proyectos aquí.
   Las imágenes van en assets/img/projects/ (recomendado 1280×800)
   y se importan arriba para que Vite las incluya en el build.
   ========================================================== */
import type { Project } from "../types";
import restaurappImg from "../../assets/img/projects/restaurapp.svg";
import ecoshopImg from "../../assets/img/projects/ecoshop.svg";
import cemexproImg from "../../assets/img/projects/cemexpro.svg";

export const PROJECTS: Project[] = [
  {
    title: "RestaurApp",
    description: "Sistema de gestión para restaurantes",
    image: restaurappImg,
    url: "#",
  },
  {
    title: "EcoShop",
    description: "Tienda en línea de productos ecológicos",
    image: ecoshopImg,
    url: "#",
  },
  {
    title: "CemexPro",
    description: "Sitio corporativo para servicios industriales",
    image: cemexproImg,
    url: "#",
  },
  {
    title: "RestaurApp Delivery",
    description: "Pedidos en línea con seguimiento en tiempo real",
    image: restaurappImg,
    url: "#",
  },
  {
    title: "EcoShop Mayoreo",
    description: "Portal B2B con catálogo y precios por volumen",
    image: ecoshopImg,
    url: "#",
  },
  {
    title: "CemexPro Panel",
    description: "Panel administrativo para control de obras",
    image: cemexproImg,
    url: "#",
  },
];
