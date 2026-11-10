/* ==========================================================
   WIZARD "COTIZA TU PROYECTO"
   Asistente de 4 pasos: Proyecto → Detalles → Información → Envío

   - Cualquier elemento con [data-open-wizard] abre el asistente.
     Si tiene valor (ej. data-open-wizard="ecommerce") preselecciona
     ese tipo de proyecto.
   - Las opciones se editan en src/data/wizard-options.ts
   - El destino del envío se configura en src/config.ts
   ========================================================== */
import { PROJECT_TYPES, FEATURES, BUDGETS, TIMELINES } from "../data/wizard-options";
import { CONFIG } from "../config";
import type { SelectOption } from "../types";
import { icon, renderIcons } from "./icons";
import { closestFromEvent, escapeHTML, qs } from "./utils";

const TOTAL_STEPS = 4;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type StepNumber = 1 | 2 | 3 | 4;
type Step = StepNumber | "success";

/** Datos capturados en el formulario. */
interface WizardData {
  projectType: string;
  description: string;
  features: string[];
  budget: string;
  timeline: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  privacy: boolean;
}

type FieldName = keyof WizardData;

/** Cada validador devuelve un mensaje de error por campo, o `false`/`""` si es válido. */
type StepErrors = Partial<Record<FieldName, string | false>>;

/** Datos que se envían a FORM_ENDPOINT. */
export interface QuotePayload {
  folio: string;
  tipo_proyecto: string | undefined;
  descripcion: string;
  funcionalidades: string;
  presupuesto: string;
  plazo: string;
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  fecha: string;
}

const VALIDATORS: Record<StepNumber, (d: WizardData) => StepErrors> = {
  1: (d) => ({
    projectType: !d.projectType && "Selecciona el tipo de proyecto.",
    description: d.description.length < 10 && "Cuéntanos un poco más (mínimo 10 caracteres).",
  }),
  2: (d) => ({
    features: !d.features.length && "Selecciona al menos una funcionalidad.",
  }),
  3: (d) => ({
    name: d.name.length < 3 && "Escribe tu nombre.",
    email: !EMAIL_RE.test(d.email) && "Escribe un correo electrónico válido.",
    phone: !/^\d{10,13}$/.test(d.phone.replace(/[\s()+-]/g, "")) && "Escribe un teléfono válido (10 dígitos).",
  }),
  4: (d) => ({
    privacy: !d.privacy && "Debes aceptar para poder enviar tu solicitud.",
  }),
};

/** Lee un valor de texto del FormData (ignora archivos). */
const text = (fd: FormData, key: string): string => {
  const value = fd.get(key);
  return typeof value === "string" ? value.trim() : "";
};

const optionLabel = (list: SelectOption[], value: string): string | undefined =>
  list.find((o) => o.value === value)?.label;

function createFolio(): string {
  const now = new Date();
  const date = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `AUR-${date}-${rand}`;
}

export function initWizard(): void {
  const maybeWizard = document.getElementById("wizard");
  if (!maybeWizard) return;
  const wizard: HTMLElement = maybeWizard;

  /* ---------- Referencias del DOM ---------- */
  const form = qs<HTMLFormElement>(wizard, "#wizard-form");
  const panels = [...wizard.querySelectorAll<HTMLElement>("[data-step]")];
  const indicators = [...wizard.querySelectorAll<HTMLElement>("[data-step-indicator]")];
  const progress = [...wizard.querySelectorAll<HTMLElement>(".wizard__progress span")];
  const counter = qs(wizard, "#wizard-counter");
  const body = qs(wizard, ".wizard__body");
  const btnBack = qs<HTMLButtonElement>(wizard, "#wizard-back");
  const btnNext = qs<HTMLButtonElement>(wizard, "#wizard-next");
  const btnNextLabel = qs(btnNext, ".btn__label");
  const summary = qs(wizard, "#wizard-summary");
  const description = qs<HTMLTextAreaElement>(form, '[name="description"]');
  const descriptionCount = qs(wizard, "#description-count");
  const privacy = qs<HTMLInputElement>(form, '[name="privacy"]');
  const budgetSelect = qs<HTMLSelectElement>(form, '[name="budget"]');
  const timelineSelect = qs<HTMLSelectElement>(form, '[name="timeline"]');

  let step: Step = 1;
  let submitted = false;
  let lastFocused: Element | null = null;

  /* ---------- Render de opciones dinámicas ---------- */
  qs(wizard, "#project-types").innerHTML = PROJECT_TYPES.map(
    (t) => `
      <label class="option-card">
        <input type="radio" name="projectType" value="${t.id}" />
        <span class="option-card__body">
          <span class="option-card__icon" aria-hidden="true">${icon(t.icon)}</span>
          <span class="option-card__title">${escapeHTML(t.title)}</span>
          <span class="option-card__text">${escapeHTML(t.text)}</span>
        </span>
        <span class="option-card__radio" aria-hidden="true"></span>
      </label>`
  ).join("");

  qs(wizard, "#features-list").innerHTML = FEATURES.map(
    (f) => `
      <label class="chip">
        <input type="checkbox" name="features" value="${f.id}" />
        <span class="chip__body">
          <span class="chip__icon" aria-hidden="true">${icon(f.icon)}</span>
          ${escapeHTML(f.label)}
        </span>
      </label>`
  ).join("");

  const toOptions = (list: SelectOption[]): string =>
    list.map((o) => `<option value="${escapeHTML(o.value)}">${escapeHTML(o.label)}</option>`).join("");
  budgetSelect.innerHTML = toOptions(BUDGETS);
  timelineSelect.innerHTML = toOptions(TIMELINES);

  /* ---------- Lectura de datos ---------- */
  function getData(): WizardData {
    const fd = new FormData(form);
    return {
      projectType: text(fd, "projectType"),
      description: text(fd, "description"),
      features: fd.getAll("features").filter((v): v is string => typeof v === "string"),
      budget: text(fd, "budget"),
      timeline: text(fd, "timeline"),
      name: text(fd, "name"),
      company: text(fd, "company"),
      email: text(fd, "email"),
      phone: text(fd, "phone"),
      privacy: privacy.checked,
    };
  }

  const projectTypeTitle = (id: string): string | undefined => PROJECT_TYPES.find((t) => t.id === id)?.title;
  const featureLabel = (id: string): string | undefined => FEATURES.find((f) => f.id === id)?.label;

  /* ---------- Validación por paso ---------- */
  /** Devuelve el primer control de un campo (en radios/checkboxes es el primero del grupo). */
  function fieldControl(field: string): HTMLElement | null {
    const item = form.elements.namedItem(field);
    if (item instanceof RadioNodeList) return item[0] instanceof HTMLElement ? item[0] : null;
    return item instanceof HTMLElement ? item : null;
  }

  function setError(field: string, message: string | false = ""): void {
    const box = form.querySelector(`[data-error-for="${field}"]`);
    if (box) box.textContent = message || "";
    const item = form.elements.namedItem(field);
    // Solo controles individuales (no grupos de radios/checkboxes)
    if (item instanceof HTMLElement) {
      item.closest(".field")?.classList.toggle("has-error", Boolean(message));
      item.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  function validateStep(n: StepNumber): boolean {
    const errors = VALIDATORS[n](getData());
    let firstInvalid: string | null = null;
    Object.entries(errors).forEach(([field, msg]) => {
      setError(field, msg);
      if (msg && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) fieldControl(firstInvalid)?.focus();
    return !firstInvalid;
  }

  // Limpia el error de un campo en cuanto el usuario lo corrige
  form.addEventListener("input", (e) => {
    const target = e.target;
    const name = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
      ? target.name
      : "";
    if (name) setError(name, "");
    if (name === "description") descriptionCount.textContent = String(description.value.length);
  });

  /* ---------- Resumen (Paso 4) ---------- */
  function renderSummary(): void {
    const d = getData();
    const features = d.features
      .map((id) => `<span class="summary__tag">${escapeHTML(featureLabel(id) || id)}</span>`)
      .join("");

    const block = (title: string, goto: StepNumber, rows: string): string => `
      <section class="summary__block">
        <div class="summary__head">
          <h4 class="summary__heading">${title}</h4>
          <button type="button" class="summary__edit" data-goto="${goto}">Editar</button>
        </div>
        <dl class="summary__list">${rows}</dl>
      </section>`;

    const row = (label: string, value: string): string => `<dt>${label}</dt><dd>${value || "—"}</dd>`;

    summary.innerHTML =
      block("Proyecto", 1,
        row("Tipo", escapeHTML(projectTypeTitle(d.projectType))) +
        row("Idea", escapeHTML(d.description))) +
      block("Detalles", 2,
        row("Funcionalidades", `<div class="summary__tags">${features}</div>`) +
        row("Presupuesto", d.budget ? escapeHTML(optionLabel(BUDGETS, d.budget)) : "") +
        row("Plazo", d.timeline ? escapeHTML(optionLabel(TIMELINES, d.timeline)) : "")) +
      block("Información", 3,
        row("Nombre", escapeHTML(d.name)) +
        row("Empresa", escapeHTML(d.company)) +
        row("Correo", escapeHTML(d.email)) +
        row("Teléfono", escapeHTML(d.phone)));
  }

  summary.addEventListener("click", (e) => {
    const btn = closestFromEvent(e, "[data-goto]");
    if (btn) goTo(Number(btn.dataset.goto) as StepNumber);
  });

  /* ---------- Navegación entre pasos ---------- */
  function goTo(target: Step, { focus = true }: { focus?: boolean } = {}): void {
    const goingBack = target !== "success" && step !== "success" && target < step;
    step = target;

    panels.forEach((panel) => {
      const active = panel.dataset.step === String(target);
      panel.hidden = !active;
      panel.classList.toggle("is-back", active && goingBack);
    });

    const n = target === "success" ? TOTAL_STEPS + 1 : target;

    indicators.forEach((li) => {
      const i = Number(li.dataset.stepIndicator);
      li.classList.toggle("is-active", i === n);
      li.classList.toggle("is-done", i < n);
      if (i === n) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    progress.forEach((bar, i) => bar.classList.toggle("is-filled", i < n));
    counter.textContent = target === "success" ? "¡Listo!" : `Paso ${target} de ${TOTAL_STEPS}`;

    if (target === 4) renderSummary();

    // Botones del pie
    if (target === "success") {
      btnBack.hidden = true;
      btnNextLabel.textContent = "Cerrar";
    } else {
      btnBack.hidden = false;
      btnBack.textContent = target === 1 ? "Cancelar" : "Atrás";
      btnNextLabel.textContent = target === TOTAL_STEPS ? "Enviar solicitud" : "Siguiente";
    }

    body.scrollTop = 0;
    if (focus) {
      const panel = panels.find((p) => p.dataset.step === String(target));
      panel?.querySelector<HTMLElement>("input, textarea, select, button")?.focus({ preventScroll: true });
    }
  }

  btnBack.addEventListener("click", () => {
    if (step === "success") return;
    if (step === 1) close();
    else goTo((step - 1) as StepNumber);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (step === "success") return close();
    if (!validateStep(step)) return;
    if (step < TOTAL_STEPS) return goTo((step + 1) as StepNumber);

    await send();
  });

  /* ---------- Envío ---------- */
  async function send(): Promise<void> {
    const d = getData();
    const folio = createFolio();
    const payload: QuotePayload = {
      folio,
      tipo_proyecto: projectTypeTitle(d.projectType),
      descripcion: d.description,
      funcionalidades: d.features.map((id) => featureLabel(id)).join(", "),
      presupuesto: optionLabel(BUDGETS, d.budget) || "",
      plazo: optionLabel(TIMELINES, d.timeline) || "",
      nombre: d.name,
      empresa: d.company,
      correo: d.email,
      telefono: d.phone,
      fecha: new Date().toISOString(),
    };

    btnNext.classList.add("is-loading");
    btnBack.disabled = true;

    try {
      if (CONFIG.FORM_ENDPOINT) {
        const res = await fetch(CONFIG.FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        // Modo demostración: simula el envío
        await new Promise((r) => setTimeout(r, 1200));
        console.info("[wizard] Envío simulado. Configura FORM_ENDPOINT en src/config.ts", payload);
      }

      submitted = true;
      qs(wizard, "#success-name").textContent = d.name.split(" ")[0] ?? "";
      qs(wizard, "#success-folio").textContent = folio;
      goTo("success");
    } catch (err) {
      console.error("[wizard] Error al enviar:", err);
      setError("privacy", `No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos a ${CONFIG.CONTACT_EMAIL}.`);
    } finally {
      btnNext.classList.remove("is-loading");
      btnBack.disabled = false;
    }
  }

  function reset(): void {
    form.reset();
    descriptionCount.textContent = "0";
    form.querySelectorAll("[data-error-for]").forEach((el) => (el.textContent = ""));
    form.querySelectorAll(".has-error").forEach((el) => el.classList.remove("has-error"));
    submitted = false;
  }

  /* ---------- Abrir / cerrar ---------- */
  function open(preselect?: string): void {
    if (submitted) reset();
    lastFocused = document.activeElement;

    if (preselect) {
      const radio = form.querySelector<HTMLInputElement>(`input[name="projectType"][value="${CSS.escape(preselect)}"]`);
      if (radio) radio.checked = true;
    }

    wizard.hidden = false;
    wizard.classList.remove("is-closing");
    document.body.classList.add("is-locked");
    goTo(1, { focus: false });
    requestAnimationFrame(() => wizard.querySelector<HTMLElement>(".wizard__close")?.focus());
  }

  function close(): void {
    if (wizard.hidden) return;
    wizard.classList.add("is-closing");
    setTimeout(() => {
      wizard.hidden = true;
      wizard.classList.remove("is-closing");
      document.body.classList.remove("is-locked");
      if (lastFocused instanceof HTMLElement) lastFocused.focus();
    }, 230);
  }

  // Botones que abren el wizard (header, hero, servicios, CTA...)
  document.addEventListener("click", (e) => {
    const trigger = closestFromEvent(e, "[data-open-wizard]");
    if (trigger) {
      e.preventDefault();
      open(trigger.dataset.openWizard);
    }
  });

  // Tarjetas de servicio: abrir también con Enter / Espacio
  document.querySelectorAll<HTMLElement>('[data-open-wizard][role="button"]').forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(el.dataset.openWizard);
      }
    });
  });

  wizard.querySelectorAll("[data-close-wizard]").forEach((el) => el.addEventListener("click", close));

  // Escape para cerrar y Tab atrapado dentro del modal
  wizard.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return close();
    if (e.key !== "Tab") return;

    const focusables = [
      ...wizard.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])'),
    ].filter((el) => !el.closest("[hidden]") && el.offsetParent !== null);

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  renderIcons(wizard);
}
