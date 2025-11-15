import { preview } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const port = process.env.PORT || 5173;

preview({
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
  preview: {
    port: parseInt(port),
    host: '0.0.0.0',
  },
});

