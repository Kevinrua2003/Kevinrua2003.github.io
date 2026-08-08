# Portfolio.dev

This is a personal portfolio website built with Astro, TypeScript, and Tailwind CSS. It includes sections for About, Experience, Education, Skills, and Projects.

## Features

*   **Multiple Sections:** Includes sections for About, Experience, Education, Skills, and Projects.
*   **Responsive Design:** The website is designed to be responsive and work on all devices.
*   **Live CV:** The portfolio data is sourced from a `cv.json` file, making it easy to update.

## Tech Stack

*   **Astro:** The web framework for building the website.
*   **TypeScript:** For type safety and improved developer experience.
*   **Tailwind CSS:** For styling the website.
*   **Vercel:** For deployment.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v22.x or later)
*   npm

### Installation

1.  Clone the repo
    ```sh
    git clone <tu-repo>
    ```
2.  Install NPM packages
    ```sh
    pnpm install
    ```

### Running the Development Server

To run the development server, use the following command:

```sh
pnpm run dev
```

This will start the development server at `http://localhost:4321`.

## Personalizing

All site content (name, summary, experience, skills, projects, profiles) lives in `cv.json`. Replace the placeholder values with your own data.

*   Replace `public/pfp.jpg` with your photo.
*   Replace `public/resume.pdf` with your CV (opened via `Ctrl+P`).
*   Replace `public/favicon.ico` and `apple-touch-icon.webp` with your own branding.
*   Set your real domain in `public/robots.txt` and `public/sitemap.xml` (currently `DOMINIO` placeholders).

## License

Distributed under the MIT License. See `LICENSE` for more information.

Theme by [Anmol-TheDev](https://github.com/Anmol-TheDev/potfolio2.0).
