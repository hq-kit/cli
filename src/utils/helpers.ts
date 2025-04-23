import fs from 'node:fs';
import { existsSync } from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';

export function readConfigFile(key: string): string {
  const configFilePath: string = path.join(process.cwd(), 'hq.json');
  if (!fs.existsSync(configFilePath)) {
    console.error(
      `${chalk.red('hq.json not found')}. ${chalk.gray(`Please run ${chalk.blue('npx hq-kit init')} to initialize the project.`)}`,
    );
    return '';
  }
  const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  return config[key];
}

export function hasFolder(folderName: string): boolean {
  const folderPath = path.join(process.cwd(), folderName);
  return fs.existsSync(folderPath);
}

export function possibilityCssPath(): string {
  if (isLaravel()) return 'resources/css/app.css';
  if (isNextJs() && hasFolder('src')) return 'src/app/globals.css';
  if (isNextJs() && !hasFolder('src')) return 'app/globals.css';
  if (isRemix()) return 'app/tailwind.css';
  if (isVite() || isAstro()) return 'src/index.css';
  return 'src/index.css';
}

export function possibilityComponentsPath(): string {
  if (isLaravel()) return 'resources/js/components';
  if (isNextJs() && hasFolder('src')) return 'src/components';
  if (isNextJs() && !hasFolder('src')) return 'components';
  if (isRemix()) return 'app/components';
  if (isVite() || isAstro()) return 'src/components';
  return 'components';
}

export function possibilityRootPath(): string {
  if (isLaravel()) return 'resources/js';
  if (isNextJs() && hasFolder('src')) return 'src';
  if (isNextJs() && !hasFolder('src')) return '';
  if (isRemix()) return 'app';
  if (isVite() || isAstro()) return 'src';
  return '';
}

export function possibilityLibPath(): string {
  if (isLaravel()) return 'resources/js/lib';
  if (isNextJs() && hasFolder('src')) return 'src/lib';
  if (isNextJs() && !hasFolder('src')) return 'lib';
  if (isRemix()) return 'lib';
  if (isVite() || isAstro()) return 'src/lib';
  return 'lib';
}

export function isNextJs(): boolean {
  return (
    fs.existsSync('next.config.ts') ||
    fs.existsSync('next.config.js') ||
    fs.existsSync('next.config.mjs')
  );
}

export function isRemix(): boolean {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const { dependencies = {}, devDependencies = {} } = packageJson;
    return (
      '@remix-run/react' in dependencies ||
      '@remix-run/react' in devDependencies
    );
  }
  return false;
}

export function isLaravel(): boolean {
  return fs.existsSync(path.resolve(process.cwd(), 'artisan'));
}

export function isVite(): boolean {
  return fs.existsSync('vite.config.ts') || fs.existsSync('vite.config.js');
}

export function isAstro(): boolean {
  return (
    fs.existsSync('astro.config.mjs') ||
    fs.existsSync('astro.config.cjs') ||
    fs.existsSync('astro.config.ts') ||
    fs.existsSync('astro.config.js')
  );
}

export function isTypescript(): boolean {
  return fs.existsSync(path.resolve(process.cwd(), 'tsconfig.json'));
}

export function getUIPath(): string {
  const uiPath = readConfigFile('ui');
  if (!uiPath) {
    return `${possibilityComponentsPath()}/ui`;
  }
  return uiPath;
}
