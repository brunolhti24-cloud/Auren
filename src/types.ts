/* ==========================================================
   TIPOS COMPARTIDOS
   ========================================================== */
import type { IconName } from "./modules/icons";

export interface Project {
  title: string;
  description: string;
  /** URL de la imagen (importada desde assets/ para que Vite la procese). */
  image: string;
  url: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** Ruta a una foto. Si se deja vacío se usan las iniciales. */
  avatar?: string;
}

export type ProjectTypeId = "web" | "ecommerce" | "system" | "other";

export interface ProjectType {
  id: ProjectTypeId;
  icon: IconName;
  title: string;
  text: string;
}

export interface Feature {
  id: string;
  icon: IconName;
  label: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
