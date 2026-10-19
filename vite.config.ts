import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // This single-page portal has no client-side routes. Relative assets work at
  // both the GitHub project URL and a custom domain without a repository prefix.
  base: './',
  plugins: [react(), tailwindcss()],
});
