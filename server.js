import { preview } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import viteConfig from './vite.config.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const port = process.env.PORT || 5173;

const server = await preview({
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
  preview: {
    port: parseInt(port),
    host: '0.0.0.0',
    allowedHosts: [
      'wdd33-sleepoutside-team3.onrender.com',
      '.onrender.com',
      'localhost',
    ],
  },
});

