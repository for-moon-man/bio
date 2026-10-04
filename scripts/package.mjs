import {
  copyFileSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  realpathSync,
  rmSync,
  existsSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { projectRoot, distDirectory, pageFiles } from '../lib/project.mjs';

// This is the only directory this script may replace. Reject redirected paths.
const root = realpathSync(projectRoot);
const destination = resolve(distDirectory);
if (realpathSync(dirname(destination)) !== root || basename(destination) !== 'dist') {
  throw new Error('The publishing directory must be dist/ inside this project.');
}
if (existsSync(destination)) {
  if (lstatSync(destination).isSymbolicLink() || realpathSync(destination) !== destination) {
    throw new Error('Refusing to replace a redirected publishing directory.');
  }
  rmSync(destination, { recursive: true });
}
mkdirSync(destination);

const extensions = new Set(['.css', '.js', '.svg', '.webp', '.woff2', '.txt']);
function copyAssets(source, target) {
  mkdirSync(target, { recursive: true });
  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`Asset symlinks are not supported: ${entry.name}`);
    if (entry.isDirectory()) copyAssets(join(source, entry.name), join(target, entry.name));
    else if (entry.isFile() && extensions.has(extname(entry.name))) {
      copyFileSync(join(source, entry.name), join(target, entry.name));
    }
  }
}
for (const file of [...pageFiles, 'sw.js', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) {
  copyFileSync(join(projectRoot, file), join(destination, file));
}
copyAssets(join(projectRoot, 'assets'), join(destination, 'assets'));
writeFileSync(join(destination, '.nojekyll'), '');
console.log('Packaged public pages, assets, and licensing notices in dist/.');
