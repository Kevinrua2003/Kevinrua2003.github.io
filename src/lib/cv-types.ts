export interface Profile {
  network: string;
  icon: string;
  color: string;
  username: string;
  url: string;
}

export interface Basics {
  name: string;
  label: string;
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

export interface Work {
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

export interface Skill {
  name: string;
  icon: string;
  level: string;
  keywords: Array<string>;
  color?: string;
}

export interface Project {
  name: string;
  isActive: boolean;
  description: string;
  highlights: Array<string>;
  url?: string;
  github?: string;
  stack?: Record<string, string>;
}

export interface Education {
  institution: string;
  url?: string;
  startDate: string;
  endDate: string;
  area: string;
}

export interface Language {
  language: string;
  fluency: string;
}

export interface CV {
  analyticsCode: string;
  basics: Basics;
  work?: Work[];
  education?: Education[];
  skills: Skill[];
  projects?: Project[];
  languages: Language[];
}
