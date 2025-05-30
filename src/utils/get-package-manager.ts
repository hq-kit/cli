import { detect } from '@antfu/ni';

export async function getPackageManager(): Promise<string> {
  const packageManager = await detect({ programmatic: true });

  if (packageManager === 'yarn@berry') return 'yarn';
  if (packageManager === 'pnpm@6') return 'pnpm';
  if (packageManager === 'bun') return 'bun';

  return packageManager ?? 'npm';
}
