import fs from 'node:fs';
import path from 'node:path';
import chalk from 'chalk';
import {
  getUIPath,
  isAstro,
  isLaravel,
  isNextJs,
  isRemix,
  isTypescript,
} from './helpers';
import { transformTsxToJsx } from './transform-jsx';

export function getWriteComponentPath(componentName: string): string {
  const uiFolder = getUIPath();
  return path.join(uiFolder, `${componentName}.tsx`);
}

export async function writeFile(url: string, writePath: string) {
  const response = await fetch(url);
  let content = await response.text();
  content = isTypescript()
    ? content
    : await transformTsxToJsx({ content, writePath });
  content = isNextJs()
    ? content
    : content.replace(/['"]use client['"]\s*\n?/g, '');

  const filePath = isTypescript()
    ? writePath
    : writePath.replace(/\.tsx$/, '.jsx').replace(/\.ts$/, '.js');

  fs.writeFileSync(filePath, content, { flag: 'w' });
}

const stubsDir = path.resolve(__dirname, '../src/resources/stubs');

export async function writeProviders(componentFolder: string) {
  let providersStubLocation: string;
  let themeToggleStubLocation: string;
  if (isNextJs()) {
    providersStubLocation = path.join(stubsDir, 'next/providers.stub');
    themeToggleStubLocation = path.join(stubsDir, 'next/theme-toggle.stub');
  } else if (isLaravel()) {
    providersStubLocation = path.join(stubsDir, 'laravel/providers.stub');
    themeToggleStubLocation = path.join(stubsDir, 'laravel/theme-toggle.stub');
  } else if (isRemix()) {
    providersStubLocation = path.join(stubsDir, 'remix/providers.stub');
    themeToggleStubLocation = path.join(stubsDir, 'remix/theme-toggle.stub');
  } else if (isAstro()) {
    providersStubLocation = path.join(stubsDir, 'astro/providers.stub');
    themeToggleStubLocation = path.join(stubsDir, 'astro/theme-toggle.stub');
  } else {
    providersStubLocation = path.join(stubsDir, 'vite/providers.stub');
    themeToggleStubLocation = path.join(stubsDir, 'vite/theme-toggle.stub');
  }
  const providersStub = fs.readFileSync(providersStubLocation, 'utf8');
  const providersContent = isTypescript()
    ? providersStub
    : await transformTsxToJsx({
        content: providersStub,
        writePath: path.join(componentFolder, 'providers.jsx'),
      });
  const providersFilePath = isTypescript()
    ? path.join(componentFolder, 'providers.tsx')
    : path.join(componentFolder, 'providers.jsx');

  fs.writeFileSync(providersFilePath, providersContent, { flag: 'w' });

  const themeToggleStub = fs.readFileSync(themeToggleStubLocation, 'utf8');
  const themeToggleContent = isTypescript()
    ? themeToggleStub
    : await transformTsxToJsx({
        content: themeToggleStub,
        writePath: path.join(componentFolder, 'theme-toggle.jsx'),
      });
  const themeToggleFilePath = isTypescript()
    ? path.join(componentFolder, 'theme-toggle.tsx')
    : path.join(componentFolder, 'theme-toggle.jsx');

  fs.writeFileSync(themeToggleFilePath, themeToggleContent, { flag: 'w' });
}

export function writeExports() {
  const uiFolder = getUIPath();
  const componentsAdded = fs.readdirSync(uiFolder);
  const exports = componentsAdded
    .filter((componentName) => !componentName.endsWith('.ts'))
    .map(
      (componentName) =>
        `export * from './${componentName.replace('.tsx', '').replace('.jsx', '')}';`,
    )
    .join('\n');
  const indexFilePath = isTypescript()
    ? path.join(uiFolder, 'index.ts')
    : path.join(uiFolder, 'index.js');
  fs.writeFileSync(indexFilePath, exports);
  console.log(
    chalk.green(`✔ ${componentsAdded.length - 1} components added to index`),
  );
}
