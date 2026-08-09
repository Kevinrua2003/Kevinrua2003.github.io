import type { CvJson } from "./cvJson";
import { formatDate, formatDateRange } from "./formatDate";
import { getContactParts, getStackText } from "./cvFormat";
import { DEFAULT_RESUME_LABELS } from "./labels";
import type { ResumeLabels } from "./labels";

/** Escapa texto para inyectarlo de forma segura en el HTML del CV. */
const esc = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export interface RenderResumeHtmlOptions {
  labels?: ResumeLabels;
  /** Id del nodo raíz (por defecto "resume-preview"). */
  id?: string;
}

/**
 * Renderiza el CV en formato Harvard como HTML (string), sin React.
 *
 * Es el reemplazo de `ResumeView.tsx` del motor original: misma estructura
 * de markup y clases de `resume.css`, pero 100% función pura. Las etiquetas
 * de sección y los textos fijos se localizan con `ResumeLabels`.
 */
export const renderResumeHtml = (
  cv: CvJson,
  options: RenderResumeHtmlOptions = {},
): string => {
  const labels = options.labels ?? DEFAULT_RESUME_LABELS;
  const { basics, work, education, certificates, skills, languages, projects } =
    cv;

  const hasContent =
    !!basics.name ||
    (work?.length ?? 0) > 0 ||
    (education?.length ?? 0) > 0 ||
    (certificates?.length ?? 0) > 0 ||
    (skills?.length ?? 0) > 0 ||
    (languages?.length ?? 0) > 0 ||
    (projects?.length ?? 0) > 0;

  const contactParts = getContactParts(basics);
  const sections: string[] = [];

  // Encabezado
  if (basics.name) {
    sections.push(`<div class="resume-name">${esc(basics.name)}</div>`);
  }
  if (basics.label) {
    sections.push(`<div class="resume-label">${esc(basics.label)}</div>`);
  }
  if (contactParts.length > 0) {
    sections.push(
      `<div class="resume-contact">${esc(contactParts.join(" | "))}</div>`,
    );
  }

  // Resumen profesional
  if (basics.summary) {
    sections.push(
      `<section><h2 class="resume-section-title">${esc(labels.sections.summary)}</h2>` +
        `<p class="resume-summary">${esc(basics.summary)}</p></section>`,
    );
  }

  // Experiencia laboral
  if (work && work.length > 0) {
    const entries = work
      .map((job) => {
        const location = [job.location_type, job.location]
          .filter(Boolean)
          .join(" · ");
        const dates = formatDateRange(job.startDate, job.endDate, !job.endDate, {
          present: labels.present,
          locale: labels.locale,
        });
        const bullets = (job.responsibilities || [])
          .filter((resp) => resp && resp.trim())
          .map((resp) => `<li>${esc(resp)}</li>`)
          .join("");
        return (
          `<div class="resume-entry">` +
          `<div class="resume-entry-header"><span class="resume-entry-title">${esc(job.name)}</span>` +
          `<span class="resume-entry-date">${esc(location)}</span></div>` +
          `<div class="resume-entry-header"><span class="resume-entry-subtitle">${esc(job.position)}</span>` +
          `<span class="resume-entry-date">${esc(dates)}</span></div>` +
          (job.summary
            ? `<p class="resume-detail">${esc(job.summary)}</p>`
            : "") +
          (bullets ? `<ul class="resume-bullets">${bullets}</ul>` : "") +
          `</div>`
        );
      })
      .join("");
    sections.push(
      `<section><h2 class="resume-section-title">${esc(labels.sections.experience)}</h2>${entries}</section>`,
    );
  }

  // Educación
  if (education && education.length > 0) {
    const entries = education
      .map((edu) => {
        const degree = [edu.studyType, edu.area]
          .filter(Boolean)
          .join(labels.degreeConnector);
        const dates = formatDateRange(edu.startDate, edu.endDate, !edu.endDate, {
          present: labels.present,
          locale: labels.locale,
        });
        const coursework = (edu.courses || [])
          .filter((course) => course && course.trim())
          .join(", ");
        return (
          `<div class="resume-entry">` +
          `<div class="resume-entry-header"><span class="resume-entry-title">${esc(edu.institution ?? "")}</span>` +
          `<span class="resume-entry-date">${esc(edu.location ?? "")}</span></div>` +
          `<div class="resume-entry-header"><span class="resume-entry-subtitle">${esc(degree)}</span>` +
          `<span class="resume-entry-date">${esc(dates)}</span></div>` +
          (edu.score
            ? `<p class="resume-detail">${esc(labels.gpa)}: ${esc(edu.score)}</p>`
            : "") +
          (coursework
            ? `<p class="resume-detail">${esc(labels.relevantCoursework)}: ${esc(coursework)}</p>`
            : "") +
          `</div>`
        );
      })
      .join("");
    sections.push(
      `<section><h2 class="resume-section-title">${esc(labels.sections.education)}</h2>${entries}</section>`,
    );
  }

  // Proyectos
  if (projects && projects.length > 0) {
    const entries = projects
      .map((project) => {
        const stack = getStackText(project.stack);
        const url = project.url || project.github || "";
        const bullets = (project.highlights || [])
          .filter((highlight) => highlight && highlight.trim())
          .map((highlight) => `<li>${esc(highlight)}</li>`)
          .join("");
        return (
          `<div class="resume-entry">` +
          `<div class="resume-entry-header"><span class="resume-entry-title">${esc(project.name)}</span>` +
          `<span class="resume-entry-date">${esc(url)}</span></div>` +
          (stack ? `<div class="resume-entry-subtitle">${esc(stack)}</div>` : "") +
          (project.description
            ? `<p class="resume-detail">${esc(project.description)}</p>`
            : "") +
          (bullets ? `<ul class="resume-bullets">${bullets}</ul>` : "") +
          `</div>`
        );
      })
      .join("");
    sections.push(
      `<section><h2 class="resume-section-title">${esc(labels.sections.projects)}</h2>${entries}</section>`,
    );
  }

  // Habilidades (grupo único)
  if (skills && skills.length > 0) {
    const names = skills
      .map((skill) => skill.name.trim())
      .filter(Boolean)
      .join(", ");
    sections.push(
      `<section><h2 class="resume-section-title">${esc(labels.sections.skills)}</h2>` +
        `<div class="resume-detail"><strong>${esc(labels.skillsLabel)}</strong> ${esc(names)}</div></section>`,
    );
  }

  // Idiomas
  if (languages && languages.length > 0) {
    const lines = languages
      .map(
        (lang) =>
          `<div class="resume-detail"><strong>${esc(lang.language)}:</strong> ${esc(lang.fluency ?? "")}</div>`,
      )
      .join("");
    sections.push(
      `<section><h2 class="resume-section-title">${esc(labels.sections.languages)}</h2>${lines}</section>`,
    );
  }

  // Certificados
  if (certificates && certificates.length > 0) {
    const entries = certificates
      .map(
        (cert) =>
          `<div class="resume-entry">` +
          `<div class="resume-entry-header"><span class="resume-entry-title">${esc(cert.name ?? "")}</span>` +
          `<span class="resume-entry-date">${esc(formatDate(cert.date, labels.locale))}</span></div>` +
          (cert.issuer
            ? `<div class="resume-entry-subtitle">${esc(cert.issuer)}</div>`
            : "") +
          `</div>`,
      )
      .join("");
    sections.push(
      `<section><h2 class="resume-section-title">${esc(labels.sections.certificates)}</h2>${entries}</section>`,
    );
  }

  // Estado vacío
  if (!hasContent) {
    sections.push(
      `<div class="resume-empty">` +
        `<p class="resume-empty-title">${esc(labels.emptyTitle)}</p>` +
        `<p class="resume-empty-sub">${esc(labels.emptySub)}</p>` +
        `</div>`,
    );
  }

  return `<div class="resume-page" id="${esc(options.id ?? "resume-preview")}">${sections.join("")}</div>`;
};
