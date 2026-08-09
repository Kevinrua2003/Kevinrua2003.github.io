/**
 * Resume Engine (adaptado del Harvard Resume Builder) — punto de entrada.
 *
 * Genera el CV desde el CvJson del idioma activo y lo exporta a PDF
 * (headless, sin preview y sin React) o DOCX. Las etiquetas se localizan
 * con `ResumeLabels` (ver `@/lib/i18n` → `UIStrings.resume`).
 *
 * Seguro para SSR/Node: html2canvas-pro, jsPDF y file-saver se importan
 * dinámicamente dentro de las funciones de exportación.
 */
export { renderResumeHtml } from "./renderResumeHtml";
export type { RenderResumeHtmlOptions } from "./renderResumeHtml";
export { exportCvToPdf } from "./exportCvToPdf";
export type { ExportCvToPdfOptions } from "./exportCvToPdf";
export { exportToPdf, elementToPdfBlob, defaultFilename } from "./exportPdf";
export { exportToDocx, buildDocx } from "./exportDocx";
export { formatDate, formatDateRange, generateId } from "./formatDate";
export { getLocationText, getContactParts, getStackText } from "./cvFormat";
export { DEFAULT_RESUME_LABELS } from "./labels";
export type { ResumeLabels } from "./labels";
export { toCvJson } from "./adapt";
export type {
  CvJson,
  CvBasics,
  CvProfile,
  CvLocation,
  CvWork,
  CvEducation,
  CvCertificate,
  CvSkill,
  CvLanguage,
  CvProject,
} from "./cvJson";
