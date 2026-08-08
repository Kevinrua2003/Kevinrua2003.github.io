declare module "@cv" {
  interface Profile {
    network: string;
    icon: string;
    color: string;
    username: string;
    url: string;
  }

  interface Basics {
    name: string;
    label: string;
    animated_main_label: string;
    animated_secondary_initial_label: string;
    animated_secondary_final_label: string;
    image: string;
    email: string;
    url: string;
    summary: string;
    location: {
      address: string;
      city: string;
      countryCode: string;
      region: string;
    };
    profiles: Profile[];
  }

  interface Work {
    name: string;
    position: string;
    url?: string;
    startDate: string;
    endDate: string | null;
    summary: string | Array<string>;
    responsibilities?: Array<string>;
    location?: string;
    location_type?: string;
    skills?: Record<string, string>;
  }

  interface Skill {
    name: string;
    icon: string;
    level: string;
    keywords: Array<string>;
  }

  interface Project {
    name: string;
    isActive: boolean;
    description: string;
    highlights: Array<string>;
    url?: string;
    github?: string;
    stack?: Record<string, string>;
  }

  interface Education {
    institution: string;
    url?: string;
    startDate: string;
    endDate: string;
    area: string;
  }

  interface Certificate {
    name: string;
    date: string;
    issuer: string;
    url?: string;
  }

  interface Language {
    language: string;
    fluency: string;
  }

  const basics: Basics;
  const work: Work[];
  const education: Education[];
  const certificates: Certificate[];
  const skills: Skill[];
  const projects: Project[];
  const languages: Language[];

  const CV: {
    analyticsCode: string;
    basics: Basics;
    work?: Work[];
    education?: Education[];
    certificates?: Certificate[];
    skills: Skill[];
    projects?: Project[];
    languages: Language[];
  };

  export { CV as default, basics, work, education, certificates, skills, projects, languages };
}