/**
 * Modelo de datos del cv.json (formato astrofolio / JSON Resume enriquecido).
 *
 * Este es el formato de entrada del motor. Un ejemplo completo con todas
 * las secciones está en example/cv.json.
 *
 * Reglas:
 * - Los arrays vacíos ocultan la sección en el CV.
 * - Las fechas pueden venir como "2025-07-01" (ISO completa) o "2025-07".
 * - endDate null/vacío + startDate → se muestra "Present".
 */

export interface CvProfile {
  network?: string;
  icon?: string;
  color?: string;
  username?: string;
  url?: string;
}

export interface CvLocation {
  address?: string;
  city?: string;
  countryCode?: string;
  region?: string;
}

export interface CvBasics {
  name: string;
  label?: string;
  animated_main_label?: string;
  animated_secondary_initial_label?: string;
  animated_secondary_final_label?: string;
  image?: string;
  email?: string;
  url?: string;
  summary?: string;
  theme?: string;
  location?: CvLocation;
  profiles?: CvProfile[];
}

export interface CvWork {
  name: string;
  position: string;
  location_type?: string;
  location?: string;
  url?: string;
  startDate?: string | null;
  endDate?: string | null;
  summary?: string;
  responsibilities?: string[];
  skills?: Record<string, string>;
}

export interface CvEducation {
  institution?: string;
  url?: string;
  area?: string;
  studyType?: string;
  startDate?: string | null;
  endDate?: string | null;
  score?: string;
  courses?: string[];
  location?: string;
}

export interface CvCertificate {
  name?: string;
  date?: string | null;
  issuer?: string;
  url?: string;
}

export interface CvSkill {
  name: string;
  icon?: string;
  level?: string;
  keywords?: string[];
}

export interface CvLanguage {
  language: string;
  fluency?: string;
}

export interface CvProject {
  name: string;
  isActive?: boolean;
  description?: string;
  highlights?: string[];
  stack?: Record<string, string>;
  url?: string;
  github?: string;
}

export interface CvJson {
  analyticsCode?: string;
  basics: CvBasics;
  work?: CvWork[];
  education?: CvEducation[];
  certificates?: CvCertificate[];
  skills?: CvSkill[];
  languages?: CvLanguage[];
  projects?: CvProject[];
}
