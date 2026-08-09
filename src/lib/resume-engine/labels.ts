/**
 * Etiquetas localizables del CV (títulos de sección, textos fijos, locale...).
 *
 * El portafolio provee los valores por idioma vía `UIStrings.resume`
 * (ver `@/lib/i18n`); el motor solo define el contrato y un fallback en
 * inglés por si se usa sin pasar etiquetas.
 */
export interface ResumeLabels {
  sections: {
    summary: string;
    experience: string;
    education: string;
    projects: string;
    skills: string;
    languages: string;
    certificates: string;
  };
  /** "Present" / "Actual" (rango de fechas abierto) */
  present: string;
  /** Etiqueta del grupo único de skills: "Skills:" / "Habilidades:" */
  skillsLabel: string;
  /** "GPA" */
  gpa: string;
  /** "Relevant Coursework" / "Cursos relevantes" */
  relevantCoursework: string;
  /** Conector del título de grado: " in " / " en " */
  degreeConnector: string;
  /** Texto del botón mientras genera: "Generating…" / "Generando…" */
  generating: string;
  /** Aria-label del botón de descarga del CV */
  downloadCv: string;
  /** Sufijo del nombre de archivo: "EN" / "ES" */
  fileSuffix: string;
  /** Locale para formatear las fechas: "en-US" / "es-ES" */
  locale: string;
  emptyTitle: string;
  emptySub: string;
}

export const DEFAULT_RESUME_LABELS: ResumeLabels = {
  sections: {
    summary: "Summary",
    experience: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    languages: "Languages",
    certificates: "Certificates",
  },
  present: "Present",
  skillsLabel: "Skills:",
  gpa: "GPA",
  relevantCoursework: "Relevant Coursework",
  degreeConnector: " in ",
  generating: "Generating…",
  downloadCv: "Download CV",
  fileSuffix: "EN",
  locale: "en-US",
  emptyTitle: "Your resume preview will appear here",
  emptySub: "Add content to your cv.json to get started",
};
