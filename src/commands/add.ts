import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { Separator, checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';
import { getWriteComponentPath, writeExports, writeFile } from '../utils';
import { getPackageManager } from '../utils/get-package-manager';
import {
  type Component,
  fetchComponentList,
  getRepoUrlForComponent,
} from '../utils/repo';

async function createComponent(componentName: string) {
  const writePath = getWriteComponentPath(componentName);
  const dir = path.dirname(writePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const spinner = ora(`Creating ${componentName}...`).start();

  const url = getRepoUrlForComponent(componentName);

  try {
    await writeFile(url, writePath);
    spinner.succeed(`${componentName} created`);
  } catch (error) {
    spinner.fail(`Error writing component to ${writePath}`);
  }
}

async function processComponent(
  componentName: string,
  packageManager: string,
  action: string,
  processed: Set<string>,
  allComponents: Component[],
  override: boolean,
  isChild = false,
) {
  const componentPath = getWriteComponentPath(componentName);

  if (fs.existsSync(componentPath)) {
    if (override && !isChild) {
      console.log(`${chalk.yellow('Replacing')} ${componentName}...`);
      fs.rmSync(componentPath, { recursive: true, force: true });
    } else {
      console.warn(
        `${chalk.blue('ℹ')} ${componentName} already exists. Use the -o flag to override.`,
      );
      return;
    }
  }

  processed.add(componentName);

  const component = allComponents.find((c) => c.name === componentName);

  if (!fs.existsSync(componentPath)) {
    if (component?.deps) {
      await installDeps(component?.deps, packageManager, action);
    }
    await createComponent(componentName);
  }

  if (component?.children) {
    for (const child of component.children) {
      await processComponent(
        child.name,
        packageManager,
        action,
        processed,
        allComponents,
        true,
        true,
      );
    }
  }
}

type componentType = {
  section: string;
  name: string;
  value: string;
};

export async function add(options: { component: string }) {
  const components = await fetchComponentList();

  const { component } = options;
  let selectedComponents = component ? component.split(' ') : [];

  if (selectedComponents.length === 0) {
    const choices = [];
    let currentSection = '';
    for (const component of components.sort((a, b) =>
      a.section.localeCompare(b.section),
    )) {
      if (component.section !== currentSection) {
        choices.push({
          type: 'separator',
          separator: `== ${component.section.toUpperCase()} ==`,
        });
        currentSection = component.section;
      }
      choices.push({
        name: component.name,
        value: component.name,
      });
    }
    selectedComponents = await checkbox({
      required: true,
      message: 'Choose components to add:',
      choices: choices,
      pageSize: 17,
      loop: false,
    });
  }

  const packageManager = await getPackageManager();
  const action = packageManager === 'npm' ? 'i ' : 'add ';

  const processed = new Set<string>();
  for (const componentName of selectedComponents) {
    const targetComponent = components.find((c) => c.name === componentName);
    if (!targetComponent) {
      console.log(chalk.yellow('No component found'));
      return;
    }
    console.log(`Starting to add ${componentName}...`);

    await processComponent(
      componentName,
      packageManager,
      action,
      processed,
      components,
      true,
    );
  }

  // Generate index file
  writeExports();
}

async function installDeps(
  deps: string[],
  packageManager: string,
  action: string,
) {
  const spinner = ora('Installing dependencies...').start();
  const installCommand = `${packageManager} ${action} ${deps.join(' ')}`;
  const child = spawn(installCommand, {
    stdio: 'ignore',
    shell: true,
  });

  await new Promise<void>((resolve) => {
    child.on('close', () => {
      spinner.stop();
      resolve();
    });
  });

  spinner.succeed('Dependencies installed');
}
