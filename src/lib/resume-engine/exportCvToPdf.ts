/**
 * Exporta el CV a PDF directamente desde el objeto CvJson — SIN React y SIN
 * necesidad de montar ninguna vista previa en tu página.
 *
 * Internamente hace todo por ti:
 *   1. Inyecta `resume.css` y la fuente EB Garamond en un contenedor oculto.
 *   2. Renderiza el CV como HTML (`renderResumeHtml`) dentro del contenedor.
 *   3. Espera a que pinten y las fuentes estén listas.
 *   4. Captura el CV con html2canvas-pro y lo pagina con jsPDF.
 *   5. Descarga el archivo (file-saver) y limpia el DOM.
 *
 * Seguro para SSR/Node: elementToPdfBlob (html2canvas + jsPDF) y file-saver
 * se importan dinámicamente dentro de la función.
 */
import type { CvJson } from "./cvJson";
import type { ResumeLabels } from "./labels";
import { renderResumeHtml } from "./renderResumeHtml";
import { defaultFilename } from "./exportPdf";
import resumeCss from "./resume.css?raw";

export interface ExportCvToPdfOptions {
  /** Nombre del archivo descargado. Por defecto "Nombre_CV_ES.pdf". */
  filename?: string;
  /** Se llama con el Blob del PDF justo antes de iniciar la descarga (útil para debug o preview). */
  onPdf?: (blob: Blob) => void;
}

const EB_GARAMOND_URL =
  "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap";

export const exportCvToPdf = async (
  cv: CvJson,
  labels: ResumeLabels,
  options: ExportCvToPdfOptions = {},
): Promise<Blob> => {
  const [{ elementToPdfBlob }, { saveAs }] = await Promise.all([
    import("./exportPdf"),
    import("file-saver"),
  ]);

  // Contenedor oculto: fijo y fuera del viewport para no afectar a la página
  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  try {
    // Estilos del CV: se inyectan aquí (no como CSS global de la página)
    const style = document.createElement("style");
    style.textContent = resumeCss;
    container.appendChild(style);

    // Fuente del CV: EB Garamond (fallback a Georgia sin conexión)
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = EB_GARAMOND_URL;
    container.appendChild(fontLink);

    // Render del CV como HTML (sin React)
    const el = document.createElement("div");
    el.innerHTML = renderResumeHtml(cv, { labels });
    container.appendChild(el);

    // Espera a que las fuentes estén listas antes de capturar
    if (document.fonts && document.fonts.load) {
      await Promise.allSettled([
        document.fonts.load('400 1em "EB Garamond"'),
        document.fonts.load('500 1em "EB Garamond"'),
        document.fonts.load('600 1em "EB Garamond"'),
        document.fonts.load('700 1em "EB Garamond"'),
        document.fonts.load('italic 400 1em "EB Garamond"'),
        document.fonts.load('italic 600 1em "EB Garamond"'),
      ]);
    }
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined))),
    );
    // Red de seguridad extra para renders lentos en otros navegadores
    await new Promise((resolve) => setTimeout(resolve, 50));

    // Avisa si resume.css no está cargado (el PDF saldría sin estilos)
    const computedWidth = getComputedStyle(el).width;
    if (computedWidth !== "816px") {
      console.warn(
        `[resume-engine] resume.css no parece estar cargado (ancho del CV: ${computedWidth}). ` +
          "Revisa la inyección de estilos en exportCvToPdf.",
      );
    }

    const blob = await elementToPdfBlob(el);
    options.onPdf?.(blob);
    saveAs(
      blob,
      options.filename ?? defaultFilename(cv.basics.name, "pdf", labels.fileSuffix),
    );
    return blob;
  } finally {
    // Limpieza: eliminamos el contenedor oculto
    document.body.removeChild(container);
  }
};
