import type { CV } from "@/lib/cv-types";
import type { CvJson, CvWork } from "./cvJson";

/**
 * Adaptador del CV del portafolio (tipos de `@/lib/cv-types`) al formato
 * que espera el motor (`CvJson`). Normaliza las pocas diferencias:
 * - `work[].summary` puede ser `string | string[]` → siempre `string`.
 */
const normalizeSummary = (summary: string | string[]): string =>
  Array.isArray(summary) ? summary.join(" ") : summary;

export const toCvJson = (cv: CV): CvJson => ({
  ...cv,
  work: (cv.work ?? []).map<CvWork>((job) => ({
    ...job,
    summary: job.summary ? normalizeSummary(job.summary) : undefined,
  })),
});
