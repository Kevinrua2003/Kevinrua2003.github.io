# Portfolio.dev

A bilingual (English / Spanish) personal portfolio built with Astro, TypeScript, and Tailwind CSS. All content is driven by JSON data files, and the CV is generated dynamically in the currently active language.

## Features

- **Bilingual (EN / ES):** Full English and Spanish versions with a language switcher. Content lives in `src/data/en-cv.json` and `src/data/es-cv.json`.
- **Dynamic CV generation:** Download your CV as **PDF** or **DOCX**, generated on the fly from the data of the active language — no static `resume.pdf` file needed.
- **Multiple sections:** Hero, About, Experience, Education, Skills, Projects, and Contact.
- **Contact form:** Powered by [Web3Forms](https://web3forms.com), with an automatic `mailto:` fallback when no access key is configured.
- **Animated background:** Canvas-based animation (fractal branches + aurora gradient blobs) with an edge mask, theme-adaptive colors, and `prefers-reduced-motion` support.
- **Custom cursor:** A context-aware custom cursor with hover modes.
- **Responsive design:** Works on all devices, with dark / light themes.
- **SEO-ready:** Sitemap, `robots.txt`, and Open Graph metadata.

## Tech Stack

- **Astro 5** (SSR, `output: 'server'`) — the web framework
- **TypeScript** — type safety and developer experience
- **Tailwind CSS** — styling
- **@astrojs/vercel** — serverless deployment on Vercel
- **astro-icon + Iconify** — icons
- **jsPDF + html2canvas-pro** — PDF generation for the CV
- **docx + file-saver** — DOCX generation for the CV
- **Web3Forms** — contact form backend

## Getting Started

### Prerequisites

- Node.js 22.x
- pnpm

### Installation

1.  Clone the repo
    ```sh
    git clone <your-repo-url>
    ```
2.  Install dependencies
    ```sh
    pnpm install
    ```

### Environment Variables

Create a `.env` file in the project root (optional — the contact form falls back to `mailto:` when the key is missing). See `.env.example`:

```
WEB3FORMS_ACCESS_KEY=your_web3forms_access_key_here
```

### Running the Development Server

```sh
pnpm run dev
```

This will start the development server at `http://localhost:4321`.

### Building

```sh
pnpm build
```

Runs `astro check` for type checking and produces the serverless build for Vercel.

## Personalizing

All site content (name, summary, experience, skills, projects, profiles) lives in the data files. Replace the placeholder values with your own data.

- **Content:** edit `src/data/en-cv.json` and `src/data/es-cv.json`. Both files must stay in sync (same fields, translated values).
- **UI strings:** edit `src/lib/i18n.ts` (section labels, buttons, form, SEO).
- **Photo:** replace `public/pfp.jpg`.
- **Favicon / branding:** replace `public/favicon.ico` and `public/apple-touch-icon.webp`.
- **Project previews:** add 16:9 images in `public/projects/` and reference them via the `image` field of each project in the JSON.
- **CV download:** no static file required — the PDF/DOCX buttons generate the CV from the active language's JSON at runtime.
- **Contact form:** set `WEB3FORMS_ACCESS_KEY` in `.env` to receive messages via Web3Forms.
- **Domain:** set your real domain in `public/robots.txt` and `public/sitemap.xml` (currently `DOMINIO` placeholders).

## License

Distributed under the MIT License. See `LICENSE` for more information.

Theme by [Anmol-TheDev](https://github.com/Anmol-TheDev/potfolio2.0).
