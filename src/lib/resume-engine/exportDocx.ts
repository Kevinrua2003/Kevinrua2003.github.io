import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
} from "docx";
import type { CvJson } from "./cvJson";
import { formatDate, formatDateRange } from "./formatDate";
import { getContactParts, getStackText } from "./cvFormat";
import { DEFAULT_RESUME_LABELS } from "./labels";
import type { ResumeLabels } from "./labels";

/**
 * Construye el documento DOCX a partir de un objeto CvJson (tu cv.json).
 * Es 100% puro: no necesita React ni DOM, por lo que también funciona
 * en Node. Las etiquetas de sección y textos fijos se localizan con
 * `ResumeLabels` (por defecto, inglés).
 */
export const buildDocx = (
  cv: CvJson,
  labels: ResumeLabels = DEFAULT_RESUME_LABELS,
): Document => {
  const { basics, work, education, certificates, skills, languages, projects } =
    cv;

  const sections: Paragraph[] = [];
  const dateOptions = {
    present: labels.present,
    locale: labels.locale,
  };

  // Encabezado — Nombre
  if (basics.name) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: basics.name.toUpperCase(),
            bold: true,
            size: 28,
            font: "Times New Roman",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
      }),
    );
  }

  // Encabezado — Etiqueta / puesto
  if (basics.label) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: basics.label,
            italics: true,
            size: 20,
            font: "Times New Roman",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
    );
  }

  // Línea de contacto
  const contactParts = getContactParts(basics);
  if (contactParts.length > 0) {
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: contactParts.join(" | "),
            size: 20,
            font: "Times New Roman",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
    );
  }

  // Resumen profesional
  if (basics.summary) {
    sections.push(createSectionHeader(labels.sections.summary.toUpperCase()));
    sections.push(createTextParagraph(basics.summary));
  }

  // Experiencia laboral
  if (work && work.length > 0) {
    sections.push(createSectionHeader(labels.sections.experience.toUpperCase()));
    work.forEach((job) => {
      const location = [job.location_type, job.location]
        .filter(Boolean)
        .join(" · ");
      sections.push(
        createEntryHeader(job.name, location),
        createEntrySubheader(
          job.position,
          formatDateRange(job.startDate, job.endDate, !job.endDate, dateOptions),
        ),
      );
      if (job.summary) {
        sections.push(createTextParagraph(job.summary));
      }
      (job.responsibilities || [])
        .filter((resp) => resp && resp.trim())
        .forEach((resp) => {
          sections.push(createBulletPoint(resp));
        });
    });
  }

  // Educación
  if (education && education.length > 0) {
    sections.push(createSectionHeader(labels.sections.education.toUpperCase()));
    education.forEach((edu) => {
      const degree = [edu.studyType, edu.area]
        .filter(Boolean)
        .join(labels.degreeConnector);
      sections.push(
        createEntryHeader(edu.institution || "", edu.location || ""),
        createEntrySubheader(
          degree,
          formatDateRange(edu.startDate, edu.endDate, !edu.endDate, dateOptions),
        ),
      );
      if (edu.score) {
        sections.push(createTextParagraph(`${labels.gpa}: ${edu.score}`));
      }
      const coursework = (edu.courses || [])
        .filter((course) => course && course.trim())
        .join(", ");
      if (coursework) {
        sections.push(
          createTextParagraph(
            `${labels.relevantCoursework}: ${coursework}`,
          ),
        );
      }
    });
  }

  // Proyectos
  if (projects && projects.length > 0) {
    sections.push(createSectionHeader(labels.sections.projects.toUpperCase()));
    projects.forEach((project) => {
      const stack = getStackText(project.stack);
      sections.push(
        createEntryHeader(project.name, project.url || project.github || ""),
      );
      if (stack) {
        sections.push(createEntrySubheader(stack, ""));
      }
      if (project.description) {
        sections.push(createTextParagraph(project.description));
      }
      (project.highlights || [])
        .filter((highlight) => highlight && highlight.trim())
        .forEach((highlight) => {
          sections.push(createBulletPoint(highlight));
        });
    });
  }

  // Habilidades (grupo único)
  if (skills && skills.length > 0) {
    sections.push(createSectionHeader(labels.sections.skills.toUpperCase()));
    const names = skills
      .map((skill) => skill.name.trim())
      .filter(Boolean)
      .join(", ");
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: labels.skillsLabel,
            bold: true,
            size: 21,
            font: "Times New Roman",
          }),
          new TextRun({
            text: ` ${names}`,
            size: 21,
            font: "Times New Roman",
          }),
        ],
        spacing: { after: 60 },
      }),
    );
  }

  // Idiomas
  if (languages && languages.length > 0) {
    sections.push(createSectionHeader(labels.sections.languages.toUpperCase()));
    languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${lang.language}: `,
              bold: true,
              size: 21,
              font: "Times New Roman",
            }),
            new TextRun({
              text: lang.fluency || "",
              size: 21,
              font: "Times New Roman",
            }),
          ],
          spacing: { after: 60 },
        }),
      );
    });
  }

  // Certificados
  if (certificates && certificates.length > 0) {
    sections.push(
      createSectionHeader(labels.sections.certificates.toUpperCase()),
    );
    certificates.forEach((cert) => {
      sections.push(
        createEntryHeader(
          cert.name || "",
          formatDate(cert.date, labels.locale),
        ),
      );
      if (cert.issuer) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: cert.issuer,
                italics: true,
                size: 21,
                font: "Times New Roman",
              }),
            ],
            spacing: { after: 60 },
          }),
        );
      }
    });
  }

  return new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
            },
          },
        },
        children: sections,
      },
    ],
  });
};

/**
 * Exporta el CV como DOCX en el navegador (descarga directa).
 */
export const exportToDocx = async (
  cv: CvJson,
  labels: ResumeLabels = DEFAULT_RESUME_LABELS,
  filename: string = "resume.docx",
): Promise<void> => {
  const { saveAs } = await import("file-saver");
  const blob = await Packer.toBlob(buildDocx(cv, labels));
  saveAs(blob, filename);
};

const createSectionHeader = (text: string): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        bold: true,
        size: 22,
        font: "Times New Roman",
      }),
    ],
    border: {
      bottom: {
        color: "000000",
        size: 6,
        style: BorderStyle.SINGLE,
      },
    },
    spacing: { before: 200, after: 100 },
  });
};

const createEntryHeader = (left: string, right: string): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text: left,
        bold: true,
        size: 21,
        font: "Times New Roman",
      }),
      new TextRun({
        text: "\t" + right,
        size: 21,
        font: "Times New Roman",
      }),
    ],
    tabStops: [
      {
        type: "right",
        position: convertInchesToTwip(7),
      },
    ],
    spacing: { after: 40 },
  });
};

const createEntrySubheader = (left: string, right: string): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text: left,
        italics: true,
        size: 21,
        font: "Times New Roman",
      }),
      new TextRun({
        text: "\t" + right,
        italics: true,
        size: 21,
        font: "Times New Roman",
      }),
    ],
    tabStops: [
      {
        type: "right",
        position: convertInchesToTwip(7),
      },
    ],
    spacing: { after: 40 },
  });
};

const createBulletPoint = (text: string): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 21,
        font: "Times New Roman",
      }),
    ],
    bullet: {
      level: 0,
    },
    spacing: { after: 40 },
  });
};

const createTextParagraph = (text: string): Paragraph => {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        size: 21,
        font: "Times New Roman",
      }),
    ],
    spacing: { after: 60 },
  });
};
