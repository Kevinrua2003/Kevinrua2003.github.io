export const formatDate = (
  dateString?: string | null,
  locale: string = "en-US",
): string => {
  if (!dateString) return "";
  let iso = dateString.trim();

  // Solo año → lo devolvemos tal cual ("2023" → "2023")
  if (/^\d{4}$/.test(iso)) return iso;
  // Normaliza YYYY-MM a YYYY-MM-01
  if (/^\d{4}-\d{2}$/.test(iso)) iso = `${iso}-01`;

  const parts = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!parts) return "";

  const year = Number(parts[1]);
  const month = Number(parts[2]);
  const day = Number(parts[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return "";

  // Construimos la fecha en hora local (evita el desfase de un día
  // que produce new Date("YYYY-MM-DD") al parsear en UTC)
  const date = new Date(year, month - 1, day);
  if (Number.isNaN(date.getTime())) return "";

  // Verificación de redondeo: "2025-04-31" o fechas imposibles → vacío
  if (date.getMonth() !== month - 1 || date.getDate() !== day) return "";

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString(locale, options);
};

export interface FormatDateRangeOptions {
  /** Etiqueta del extremo abierto: "Present" / "Actual" */
  present?: string;
  /** Locale del formato de fecha: "en-US" / "es-ES" */
  locale?: string;
}

export const formatDateRange = (
  startDate?: string | null,
  endDate?: string | null,
  current?: boolean,
  options: FormatDateRangeOptions = {},
): string => {
  const { present = "Present", locale = "en-US" } = options;
  const start = formatDate(startDate, locale);
  const end = current ? present : formatDate(endDate, locale);

  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;

  return `${start} – ${end}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
