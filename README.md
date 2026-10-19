# Supreme Leader Hanrui Chen — Central Portal

A ceremonial Korean-language newspaper portal with an illustrated mountain-and-scarlet-banner masthead, red section bars, and bilingual navigation with a destiny calculator, eight factor sliders, seeded alternate timelines, intelligence reports, historical charts, and persistent honors. Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Recharts. No backend or API keys are required.

## Development

```sh
npm ci
npm run dev
```

## Production checks

```sh
npm test
npm run build
npx playwright install chromium
npm run test:pages
```

`test:pages` serves the actual `dist` artifact and checks rendering and interactions at both `/` and `/HanruiforPresident/`, mobile overflow, failed-script recovery, and JavaScript-disabled instructions. To use an existing Chromium installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its executable path.

## GitHub Pages

In repository Settings → Pages, choose **GitHub Actions** as the source. The `Deploy app to GitHub Pages` workflow builds and browser-tests `dist` before uploading it. Changes merged to `main` trigger deployment. Do not publish the raw source directory: `index.html` in the source tree references TypeScript, while the built `dist/index.html` references compiled JavaScript.

Vite uses relative asset URLs so the same build works on a project path or custom domain. A static loading masthead remains visible until React mounts. Failed script loading provides a reload prompt, disabled JavaScript shows instructions, and render errors show a recovery page.

The Korean masthead uses self-hosted Noto Serif KR (SIL Open Font License, included under `public/licenses`). The illustrated header is bundled locally; the app does not depend on external image or font hosts.
