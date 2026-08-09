import type { CvBasics, CvLocation } from "./cvJson";

/** "Alamar, La Habana, Cuba" a partir del objeto location */
export const getLocationText = (location?: CvLocation): string => {
  if (!location) return "";
  return [location.address, location.city, location.region]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(", ");
};

/** Línea de contacto: ubicación | email | url | urls de perfiles */
export const getContactParts = (basics: CvBasics): string[] => {
  const parts: (string | undefined)[] = [
    getLocationText(basics.location),
    basics.email,
    basics.url,
  ];
  for (const profile of basics.profiles || []) {
    if (!profile.url) continue;
    if (profile.network && profile.network.toLowerCase() === "email") continue;
    parts.push(profile.url);
  }
  return parts.filter((part): part is string => Boolean(part && part.trim()));
};

/** Nombres del stack de un proyecto, separados por coma (recortando claves) */
export const getStackText = (stack?: Record<string, string>): string =>
  Object.keys(stack || {})
    .map((key) => key.trim())
    .filter(Boolean)
    .join(", ");
