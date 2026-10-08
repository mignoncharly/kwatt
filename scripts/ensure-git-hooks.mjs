import { chmod, readdir } from 'node:fs/promises';

const hookDirectory = new URL('../.husky/_/', import.meta.url);

try {
  const entries = await readdir(hookDirectory, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name !== 'h' && entry.name !== 'husky.sh')
      .map((entry) => chmod(new URL(entry.name, hookDirectory), 0o755)),
  );
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
