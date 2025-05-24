import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { writeFile, writeProviders } from '../utils';
import { getPackageManager } from '../utils/get-package-manager';
import {
  isAstro,
  isLaravel,
  isNextJs,
  isRemix,
  isVite,
  possibilityComponentsPath,
  possibilityCssPath,
  possibilityLibPath,
} from '../utils/helpers';
import { cssSource, hooksSource, utilsSource } from '../utils/repo';

export async function init() {
  let componentFolder: string;
  let uiFolder: string;
  let cssLocation: string;
  let libFolder: string;

  componentFolder = await input({
    message: 'Enter the path to your components folder:',
    default: possibilityComponentsPath(),
    validate: (value) =>
      value.trim() !== '' || 'Path cannot be empty. Please enter a valid path.',
  });

  uiFolder = path.join(componentFolder, 'ui');

  libFolder = await input({
    message: 'Enter the path to your lib folder:',
    default: possibilityLibPath(),
    validate: (value) =>
      value.trim() !== '' || 'Path cannot be empty. Please enter a valid path.',
  });

  cssLocation = await input({
    message: 'Where would you like to place the CSS file?',
    default: possibilityCssPath(),
    validate: (value) =>
      value.trim() !== '' || 'Path cannot be empty. Please enter a valid path.',
  });

  if (!fs.existsSync(uiFolder)) {
    fs.mkdirSync(uiFolder, { recursive: true });
  }

  if (!fs.existsSync(libFolder)) {
    fs.mkdirSync(libFolder, { recursive: true });
  }

  const config = {
    $schema: 'https://hq-ui.vercel.app/schema.json',
    ui: uiFolder,
    css: cssLocation,
    lib: libFolder,
  };

  const spinner = ora('Initializing HQ...').start();

  // Handle CSS file placement (always overwrite)
  if (!fs.existsSync(path.dirname(cssLocation))) {
    fs.mkdirSync(path.dirname(cssLocation), { recursive: true });
    spinner.succeed(
      `Created directory for CSS at ${chalk.blue(path.dirname(cssLocation))}`,
    );
  }

  const packageManager = await getPackageManager();
  const mainPackages = 'react-aria-components hq-icons';
  let devPackages =
    'tailwindcss tailwindcss-react-aria-components tailwind-variants clsx tw-animate-css';

  if (isNextJs()) {
    devPackages += ' next-themes @tailwindcss/postcss postcss';
  }

  if (isLaravel() || isVite() || isAstro()) {
    devPackages += ' @tailwindcss/vite @types/node';
  }

  if (isRemix()) {
    devPackages += ' remix-themes';
  }

  const action = packageManager === 'npm' ? 'i' : 'add';
  const installCommand = `${packageManager} ${action} ${mainPackages} && ${packageManager} ${action} -D ${devPackages}`;

  spinner.info('Installing dependencies...');

  const child = spawn(installCommand, { stdio: 'inherit', shell: true });

  await new Promise<void>((resolve) => {
    child.on('close', () => {
      resolve();
    });
  });

  // Write CSS file
  try {
    await writeFile(cssSource, cssLocation);
    spinner.succeed(`CSS file copied to ${cssLocation}`);
  } catch (error) {
    spinner.fail(`Failed to write CSS file to ${cssLocation}`);
  }

  // Write utils file
  try {
    await writeFile(utilsSource, path.join(libFolder, 'utils.ts'));
    spinner.succeed(`utils file copied to ${libFolder}`);
  } catch (error) {
    spinner.fail('Error writing utils file');
  }

  // Write hooks file
  try {
    await writeFile(hooksSource, path.join(libFolder, 'hooks.ts'));
    spinner.succeed(`hooks file copied to ${libFolder}`);
  } catch (error) {
    spinner.fail('Error writing hooks file');
  }

  // Write providers and theme-toggle file
  try {
    await writeProviders(componentFolder);
    spinner.succeed(
      `Theme provider and providers files copied to ${componentFolder}`,
    );
  } catch (error) {
    spinner.fail(`Failed to write Providers file: ${(error as Error).message}`);
  }

  // Save configuration to hq.json with relative path
  if (fs.existsSync('hq.json')) {
    fs.unlinkSync('hq.json');
  }

  fs.writeFileSync('hq.json', JSON.stringify(config, null, 2));
  spinner.succeed('Configuration saved to hq.json');

  // Wait for the installation to complete before proceeding
  spinner.succeed('Installation complete.');

  console.log(chalk.blueBright('========================'));
  console.log('||  Happy coding!  🔥 ||');
  console.log(chalk.blueBright('========================'));

  console.info('\nNow try to add some components to your project');
  console.info(`by running: ${chalk.blue('npx hq-kit add <component-name>')}`);

  spinner.stop();
}
