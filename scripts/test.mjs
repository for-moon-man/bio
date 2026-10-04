import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { projectRoot } from '../lib/project.mjs';

const files = readdirSync(join(projectRoot, 'test'))
  .filter((file) => file.endsWith('.test.mjs'))
  .sort()
  .map((file) => join(projectRoot, 'test', file));
if (!files.length) throw new Error('No test files found.');

const result = spawnSync(process.execPath, ['--test', ...files, ...process.argv.slice(2)], {
  cwd: projectRoot,
  stdio: 'inherit',
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
