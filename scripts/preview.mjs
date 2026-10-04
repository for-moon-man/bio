import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { distDirectory } from '../lib/project.mjs';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};
const outside = (path) => path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path);

export async function createPreviewServer(directory = distDirectory) {
  const root = await realpath(directory);
  return createServer(async (request, response) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', 'no-store');
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    try {
      const pathname = decodeURIComponent((request.url || '/').split('?')[0]);
      const segments = pathname.replaceAll('\\', '/').split('/');
      if (
        segments.some((part) => part === '..' || part.startsWith('.')) ||
        pathname.includes('\0')
      ) {
        response.writeHead(403).end();
        return;
      }
      const filename = pathname.endsWith('/') ? `${pathname}index.html` : pathname;
      const target = await realpath(resolve(root, `.${filename}`));
      if (outside(relative(root, target))) {
        response.writeHead(403).end();
        return;
      }
      if (!(await stat(target)).isFile()) {
        response.writeHead(404).end();
        return;
      }
      const content = await readFile(target);
      response.writeHead(200, {
        'Content-Type': types[extname(target)] || 'text/plain; charset=utf-8',
        'Content-Length': content.length,
      });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) {
      response.writeHead(error instanceof URIError ? 400 : 404).end();
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const port = Number(process.env.PORT || 4173);
    if (!Number.isInteger(port) || port < 1 || port > 65535)
      throw new Error('PORT must be between 1 and 65535.');
    const server = await createPreviewServer();
    server.on('error', (error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
    server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}`));
  } catch (error) {
    console.error(`Unable to preview the site. Run npm run build first. ${error.message}`);
    process.exitCode = 1;
  }
}
