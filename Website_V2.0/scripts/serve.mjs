import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';
const types = { '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return;
  }
  try {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
    catch { response.writeHead(400); response.end('Bad request'); return; }
    if (pathname.includes('\0')) { response.writeHead(400); response.end('Bad request'); return; }
    const requested = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (requested !== root && !requested.startsWith(root + path.sep)) {
      response.writeHead(403); response.end('Forbidden'); return;
    }
    let file = requested;
    let status = 200;
    try { if (!(await stat(file)).isFile()) throw new Error('Not a file'); }
    catch { file = path.join(root, '404.html'); status = 404; }
    const data = await readFile(file);
    response.writeHead(status, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Content-Length': data.length, 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    response.writeHead(500); response.end('Run npm run build before starting the preview server.');
  }
});
server.on('error', error => { console.error(`Preview server: ${error.message}`); process.exitCode = 1; });
server.listen(port, host, () => console.log(`Portfolio available at http://${host}:${port}`));
