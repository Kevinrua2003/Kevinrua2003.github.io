// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import astroIcon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://kevinrua2003.github.io',
  base: '/portfolio/',
  integrations: [
    tailwind(),
    astroIcon({
      include: {
        mdi: ["*"],
        ri: ['*'],
        'simple-icons': ['*'],
      },
    }),
  ],
});