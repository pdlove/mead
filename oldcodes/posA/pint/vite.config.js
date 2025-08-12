import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  server: {
    port: 3000,
    allowedHosts: ['test.tamingit.info'], // ⬅️ Add your custom host here
  },
});
