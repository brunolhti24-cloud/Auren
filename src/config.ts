/* ==========================================================
   CONFIGURACIÓN GENERAL
   ========================================================== */
export interface Config {
  FORM_ENDPOINT: string;
  CONTACT_EMAIL: string;
  TESTIMONIALS_AUTOPLAY: number;
}

export const CONFIG: Config = {
  /*
   * URL a donde se envía la cotización (método POST, formato JSON).
   * Ejemplo con Formspree (gratis): "https://formspree.io/f/TU_ID"
   * Si se deja vacío, el envío se SIMULA (útil para desarrollo).
   */
  FORM_ENDPOINT: "",

  /* Correo que se muestra si ocurre un error al enviar */
  CONTACT_EMAIL: "contacto@auren.dev",

  /* Cambio automático de testimonios (milisegundos). 0 = desactivado */
  TESTIMONIALS_AUTOPLAY: 7000,
};
