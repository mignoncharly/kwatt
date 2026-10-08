import { chmod } from 'node:fs/promises';

const preCommitHook = new URL('../.husky/_/pre-commit', import.meta.url);

try {
  await chmod(preCommitHook, 0o755);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
