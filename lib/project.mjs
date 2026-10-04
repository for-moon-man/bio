import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export const projectRoot = fileURLToPath(new URL('../', import.meta.url));
export const distDirectory = join(projectRoot, 'dist');
export const pageFiles = [
  'index.html',
  'biography.html',
  'missions.html',
  'honours.html',
  'gallery.html',
  'tamil.html',
  'sources.html',
];
