import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_RUNTIME_BYTES = 8 * 1024 * 1024;
const RUNTIME_FILES = ['index.html', 'styles.css', 'game.js', 'strings.json'];
const forbiddenPatterns = [
  /https?:\/\//i,
  /fetch\s*\(/i,
  /XMLHttpRequest/i,
  /WebSocket/i,
  /console\.log/i,
  /<script\b[^>]*\bsrc\s*=\s*["'](?!\.\/)[^"']+["']/i,
  /<link\b[^>]*\bhref\s*=\s*["'](?!\.\/)[^"']+["']/i
];

export function scanRuntimeFiles(entries, maxBytes = MAX_RUNTIME_BYTES) {
  const violations = [];
  for (const entry of entries) {
    const content = typeof entry === 'string' ? entry : entry.content;
    const name = typeof entry === 'string' ? 'fixture' : entry.name;
    if (Buffer.byteLength(content, 'utf8') > maxBytes) violations.push(`${name}: exceeds ${maxBytes} bytes`);
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(content)) violations.push(`${name}: matches ${pattern}`);
    }
  }
  return { ok: violations.length === 0, violations };
}

function runCli() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const entries = RUNTIME_FILES.map(name => ({
    name,
    content: fs.readFileSync(path.join(root, name), 'utf8')
  }));
  const result = scanRuntimeFiles(entries);
  if (!result.ok) {
    process.stderr.write(`${result.violations.join('\n')}\n`);
    process.exitCode = 1;
    return;
  }
  const totalBytes = entries.reduce((total, entry) => total + Buffer.byteLength(entry.content, 'utf8'), 0);
  process.stdout.write(`Runtime clean: ${totalBytes} bytes across ${entries.length} files.\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
