/**
 * Exportación a PDF.
 *
 * Requiere navegador (usa html2canvas-pro + jsPDF). Los imports son
 * dinámicos para que este módulo pueda cargarse de forma segura en
 * Node/SSR sin romper el build (p. ej. en Astro).
 */

export const defaultFilename = (
  fullName: string,
  ext: "pdf" | "docx",
  suffix?: string,
): string => {
  const base = (fullName || "resume")
    .trim()
    .toLowerCase()
    // Quita tildes/diacríticos para nombres en español (María → Maria)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
  return `${base}_CV${suffix ? `_${suffix}` : ""}.${ext}`;
};

const PAGE_WIDTH_IN = 8.5;
const PAGE_HEIGHT_IN = 13;
const MARGIN_IN = 0.5;
const SCALE = 2;

/**
 * Captura un elemento del DOM (el CV renderizado) y devuelve el Blob
 * del PDF paginado en hojas de 8.5"×13" (multi-página automático).
 *
 * No dispara la descarga: eso lo hacen exportToPdf y exportCvToPdf.
 * Clona el elemento y lo coloca fuera de pantalla, así que el elemento
 * original no se ve afectado.
 */
export const elementToPdfBlob = async (element: HTMLElement): Promise<Blob> => {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);

  // Clonamos el elemento para capturarlo sin afectar a la vista en pantalla
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${PAGE_WIDTH_IN}in`;
  clone.style.position = "absolute";
  clone.style.left = "-9999px";
  clone.style.top = "0";
  clone.style.backgroundColor = "#ffffff";
  // La sombra es un artefacto de la vista web: no debe salir en el PDF
  // (también infla el tamaño del PNG y el peso del archivo final)
  clone.style.boxShadow = "none";
  document.body.appendChild(clone);

  try {
    const canvas = await html2canvas(clone, {
      scale: SCALE,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: [PAGE_WIDTH_IN, PAGE_HEIGHT_IN],
    });

    const pxPerIn = canvas.width / PAGE_WIDTH_IN;
    const totalHeightPx = canvas.height;

    let currentYPx = 0;
    let pageIndex = 0;

    // Dividimos el canvas en tantas páginas como sea necesario
    while (currentYPx < totalHeightPx) {
      if (pageIndex > 0) pdf.addPage();

      const topOffsetIn = pageIndex === 0 ? 0 : MARGIN_IN;
      const bottomOffsetIn = MARGIN_IN;

      const availableHeightIn = PAGE_HEIGHT_IN - topOffsetIn - bottomOffsetIn;
      const sliceHeightPx = Math.min(
        availableHeightIn * pxPerIn,
        totalHeightPx - currentYPx,
      );

      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeightPx;
      const sliceCtx = sliceCanvas.getContext("2d");
      if (!sliceCtx) throw new Error("Could not get 2D context for PDF slice");

      sliceCtx.drawImage(
        canvas,
        0,
        currentYPx,
        canvas.width,
        sliceHeightPx,
        0,
        0,
        sliceCanvas.width,
        sliceCanvas.height,
      );

      // JPEG en vez de PNG: jsPDF embele los PNG como RGB sin comprimir
      // (PDFs de 20+ MB); con JPEG pasa el flujo DCTDecode tal cual y una
      // página casi blanca queda en ~200 KB con calidad casi idéntica.
      const sliceData = sliceCanvas.toDataURL("image/jpeg", 0.92);
      const imgHeightIn = sliceHeightPx / pxPerIn;

      pdf.addImage(
        sliceData,
        "JPEG",
        0,
        topOffsetIn,
        PAGE_WIDTH_IN,
        imgHeightIn,
      );

      currentYPx += sliceHeightPx;
      pageIndex++;
    }

    return pdf.output("blob") as Blob;
  } finally {
    document.body.removeChild(clone);
  }
};

/**
 * Exporta el elemento con el id dado (el CV renderizado) como PDF,
 * descargándolo con el nombre indicado.
 */
export const exportToPdf = async (
  elementId: string,
  filename: string = "resume.pdf",
): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  const { saveAs } = await import("file-saver");
  const blob = await elementToPdfBlob(element);
  saveAs(blob, filename);
};
