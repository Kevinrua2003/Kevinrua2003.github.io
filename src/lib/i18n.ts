import type { CV } from './cv-types';
import en from '../data/en-cv.json';
import es from '../data/es-cv.json';

export const LANGS = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'es', label: 'ES', name: 'Español' },
] as const;

export type LangCode = (typeof LANGS)[number]['code'];

export const DEFAULT_LANG: LangCode = 'en';

export const isLang = (code: string): code is LangCode =>
  LANGS.some((lang) => lang.code === code);

const CV_DATA: Record<LangCode, CV> = {
  en: en as CV,
  es: es as CV,
};

export const getCV = (lang: LangCode): CV => CV_DATA[lang];

export interface UIStrings {
  sections: {
    about: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    contact: string;
  };
  eyebrows: {
    about: string;
    experience: string;
    projects: string;
    skills: string;
    education: string;
    contact: string;
  };
  contact: {
    name: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    placeholderName: string;
    placeholderEmail: string;
    placeholderSubject: string;
    placeholderMessage: string;
  };
  skills: {
    all: string;
    frontend: string;
    backend: string;
    data: string;
    tools: string;
  };
  options: {
    aria: string;
    toggleDark: string;
    lightMode: string;
    darkMode: string;
    printResume: string;
    printResumeAria: string;
    switchLanguage: string;
  };
  hero: {
    aboutMe: string;
    socialMedia: string;
    opensInNewTab: (label: string) => string;
  };
  experience: {
    present: string;
    summary: string;
    responsibilities: string;
    showMore: string;
    showLess: string;
    technologies: string;
    view: (name: string) => string;
  };
  projects: {
    view: (name: string) => string;
    viewGithub: (name: string) => string;
    technologies: string;
  };
  education: {
    current: string;
  };
  seo: {
    description: (name: string, label: string) => string;
    keywords: string[];
    home: string;
    projects: string;
    about: string;
    contact: string;
    siteName: (name: string) => string;
    ogLocale: string;
    htmlLang: string;
  };
}

const UI: Record<LangCode, UIStrings> = {
  en: {
    sections: {
      about: 'About',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      education: 'Education',
      contact: 'Contact',
    },
    eyebrows: {
      about: '// about',
      experience: '// experience',
      projects: '// projects',
      skills: '// skills',
      education: '// education',
      contact: '// contact',
    },
    contact: {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent successfully!',
      error: 'An error occurred while sending the message.',
      placeholderName: 'John Doe',
      placeholderEmail: 'john@example.com',
      placeholderSubject: 'Project inquiry / Feedback',
      placeholderMessage: 'Write your message here...',
    },
    skills: {
      all: 'All',
      frontend: 'Frontend & UI',
      backend: 'Backend & Databases',
      data: 'Data & Automation',
      tools: 'Tools & DevOps',
    },
    options: {
      aria: 'Options',
      toggleDark: 'Toggle dark mode',
      lightMode: 'Light mode',
      darkMode: 'Dark mode',
      printResume: 'Print resume',
      printResumeAria: 'Print resume (opens in a new tab)',
      switchLanguage: 'Switch language',
    },
    hero: {
      aboutMe: 'About me',
      socialMedia: 'Social media',
      opensInNewTab: (label) => `${label} (opens in a new tab)`,
    },
    experience: {
      present: 'Present',
      summary: 'Summary:',
      responsibilities: 'Responsibilities:',
      showMore: 'Show more',
      showLess: 'Show less',
      technologies: 'Technologies used',
      view: (name) => `View ${name}`,
    },
    projects: {
      view: (name) => `View ${name}`,
      viewGithub: (name) => `View ${name} in GitHub`,
      technologies: 'Technologies used',
    },
    education: {
      current: 'Current',
    },
    seo: {
      description: (name, label) =>
        `${name} - ${label}. Explore my portfolio, projects, and contact info.`,
      keywords: ['Software Developer', 'Web Developer', 'Portfolio'],
      home: 'Home',
      projects: 'Projects',
      about: 'About',
      contact: 'Contact',
      siteName: (name) => `${name}'s Portfolio`,
      ogLocale: 'en_US',
      htmlLang: 'en',
    },
  },
  es: {
    sections: {
      about: 'Sobre mí',
      experience: 'Experiencia',
      projects: 'Proyectos',
      skills: 'Habilidades',
      education: 'Educación',
      contact: 'Contacto',
    },
    eyebrows: {
      about: '// sobre mí',
      experience: '// experiencia',
      projects: '// proyectos',
      skills: '// habilidades',
      education: '// educación',
      contact: '// contacto',
    },
    contact: {
      name: 'Nombre',
      email: 'Correo electrónico',
      subject: 'Asunto',
      message: 'Mensaje',
      send: 'Enviar mensaje',
      sending: 'Enviando...',
      success: '¡Mensaje enviado con éxito!',
      error: 'Hubo un error al enviar el mensaje.',
      placeholderName: 'Tu nombre',
      placeholderEmail: 'tu.correo@ejemplo.com',
      placeholderSubject: 'Consulta sobre un proyecto / Propuesta',
      placeholderMessage: 'Escribe tu mensaje aquí...',
    },
    skills: {
      all: 'Todas',
      frontend: 'Frontend & UI',
      backend: 'Backend & Bases de Datos',
      data: 'Data & Automatización',
      tools: 'Herramientas',
    },
    options: {
      aria: 'Opciones',
      toggleDark: 'Cambiar modo oscuro',
      lightMode: 'Modo claro',
      darkMode: 'Modo oscuro',
      printResume: 'Imprimir CV',
      printResumeAria: 'Imprimir CV (se abre en una pestaña nueva)',
      switchLanguage: 'Cambiar idioma',
    },
    hero: {
      aboutMe: 'Sobre mí',
      socialMedia: 'Redes sociales',
      opensInNewTab: (label) => `${label} (se abre en una pestaña nueva)`,
    },
    experience: {
      present: 'Actual',
      summary: 'Resumen:',
      responsibilities: 'Responsabilidades:',
      showMore: 'Ver más',
      showLess: 'Ver menos',
      technologies: 'Tecnologías usadas',
      view: (name) => `Ver ${name}`,
    },
    projects: {
      view: (name) => `Ver ${name}`,
      viewGithub: (name) => `Ver ${name} en GitHub`,
      technologies: 'Tecnologías usadas',
    },
    education: {
      current: 'Actual',
    },
    seo: {
      description: (name, label) =>
        `${name} - ${label}. Explora mi portafolio, proyectos e información de contacto.`,
      keywords: ['Desarrollador de Software', 'Desarrollador Web', 'Portafolio'],
      home: 'Inicio',
      projects: 'Proyectos',
      about: 'Sobre mí',
      contact: 'Contacto',
      siteName: (name) => `Portafolio de ${name}`,
      ogLocale: 'es_ES',
      htmlLang: 'es',
    },
  },
};

export const getUI = (lang: LangCode): UIStrings => UI[lang];
