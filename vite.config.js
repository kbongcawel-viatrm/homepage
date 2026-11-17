import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  plugins: [{
    name: 'copy-resume-pdf',
    closeBundle() {
      const destination = resolve('dist', 'Resume-2027.pdf');
      mkdirSync(resolve('dist'), { recursive: true });
      copyFileSync(resolve('assets', 'Resume-2027.pdf'), destination);
    }
  }]
});
