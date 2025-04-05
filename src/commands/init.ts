import { input } from '@inquirer/prompts'
import chalk from 'chalk'
import { spawn } from 'child_process'
import fs from 'fs'
import ora from 'ora'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPackageManager } from '../utils/get-package-manager'
import {
    isLaravel,
    isNextJs,
    isRemix,
    isTypescript,
    isVite,
    possibilityComponentsPath,
    possibilityCssPath,
    possibilityLibPath,
} from '../utils/helpers'
import { transformTsxToJsx } from '../utils/transform-jsx'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const resourceDir = path.resolve(__dirname, '../src/resources')
export const stubsDir = path.resolve(__dirname, '../src/resources/stubs')

export async function init() {
    let componentFolder: string, uiFolder: string, cssLocation: string, providers: string, libFolder: string

    componentFolder = await input({
        message: 'Enter the path to your components folder:',
        default: possibilityComponentsPath(),
        validate: (value) => value.trim() !== '' || 'Path cannot be empty. Please enter a valid path.',
    })

    uiFolder = path.join(componentFolder, 'ui')

    libFolder = await input({
        message: 'Enter the path to your library folder:',
        default: possibilityLibPath(),
        validate: (value) => value.trim() !== '' || 'Path cannot be empty. Please enter a valid path.',
    })

    cssLocation = await input({
        message: 'Where would you like to place the CSS file?',
        default: possibilityCssPath(),
        validate: (value) => value.trim() !== '' || 'Path cannot be empty. Please enter a valid path.',
    })

    const utilsSourceFile = isTypescript() ? path.join(stubsDir, 'utils.stub') : path.join(stubsDir, 'utils-js.stub')
    const hooksSourceFile = isTypescript() ? path.join(stubsDir, 'hooks.stub') : path.join(stubsDir, 'hooks-js.stub')

    if (isNextJs()) {
        providers = path.join(stubsDir, 'next/providers.stub')
    } else if (isLaravel()) {
        providers = path.join(stubsDir, 'laravel/providers.stub')
    } else if (isRemix()) {
        providers = path.join(stubsDir, 'remix/providers.stub')
    } else {
        providers = path.join(stubsDir, 'vite/providers.stub')
    }

    if (!fs.existsSync(uiFolder)) {
        fs.mkdirSync(uiFolder, { recursive: true })
    }

    const config = { $schema: 'https://hq-ui.vercel.app', ui: uiFolder, css: cssLocation, lib: libFolder }

    const spinner = ora(`Initializing HQ...`).start()

    // Handle CSS file placement (always overwrite)
    const cssSourcePath = path.join(resourceDir, 'app.css')
    if (!fs.existsSync(path.dirname(cssLocation))) {
        fs.mkdirSync(path.dirname(cssLocation), { recursive: true })
        spinner.succeed(`Created directory for CSS at ${chalk.blue(path.dirname(cssLocation))}`)
    }

    if (fs.existsSync(cssSourcePath)) {
        try {
            const cssContent = fs.readFileSync(cssSourcePath, 'utf8')
            fs.writeFileSync(cssLocation, cssContent, { flag: 'w' })
            spinner.succeed(`CSS file copied to ${cssLocation}`)
        } catch (error) {
            spinner.fail(`Failed to write CSS file to ${cssLocation}`)
        }
    } else {
        spinner.warn(`Source CSS file does not exist at ${cssSourcePath}`)
    }

    const packageManager = await getPackageManager()
    let mainPackages = ['react-aria-components', 'hq-icons', 'tailwindcss', 'tailwindcss-react-aria-components'].join(
        ' ',
    )
    let devPackages = ['tailwind-variants', 'clsx', 'tailwindcss-animate'].join(' ')

    if (isNextJs()) {
        devPackages += ' next-themes @tailwindcss/postcss postcss'
    }

    if (isLaravel() || isVite()) {
        devPackages += ' @tailwindcss/vite'
    }

    if (isRemix()) {
        devPackages += ' remix-themes'
    }

    const action = packageManager === 'npm' ? 'i' : 'add'
    const installCommand = `${packageManager} ${action} ${mainPackages} && ${packageManager} ${action} -D ${devPackages}`

    spinner.info(`Installing dependencies...`)

    const child = spawn(installCommand, { stdio: 'inherit', shell: true })

    await new Promise<void>((resolve) => {
        child.on('close', () => {
            resolve()
        })
    })

    const utilsContent = fs.readFileSync(utilsSourceFile, 'utf8')
    if (isTypescript()) {
        fs.writeFileSync(path.join(libFolder, 'utils.ts'), utilsContent, { flag: 'w' })
    } else {
        fs.writeFileSync(path.join(libFolder, 'utils.js'), utilsContent, { flag: 'w' })
    }
    spinner.succeed(`utils file copied to ${libFolder}`)

    const hooksContent = fs.readFileSync(hooksSourceFile, 'utf8')
    if (isTypescript()) {
        fs.writeFileSync(path.join(libFolder, 'hooks.tsx'), hooksContent, { flag: 'w' })
    } else {
        fs.writeFileSync(path.join(libFolder, 'hooks.jsx'), hooksContent, { flag: 'w' })
    }
    spinner.succeed(`hooks file copied to ${libFolder}`)

    try {
        const providersContent = fs.readFileSync(providers, 'utf8')
        if (isTypescript()) {
            fs.writeFileSync(path.join(componentFolder, 'providers.tsx'), providersContent, { flag: 'w' })
        } else {
            const providersContentJsx = await transformTsxToJsx({
                content: providersContent,
                writePath: path.join(componentFolder, 'providers.jsx'),
            })
            fs.writeFileSync(path.join(componentFolder, 'providers.jsx'), providersContentJsx, { flag: 'w' })
        }

        spinner.succeed(`Theme provider and providers files copied to ${componentFolder}`)
    } catch (error) {
        // @ts-ignore
        spinner.fail(`Failed to write Providers file: ${error.message}`)
    }

    // Save configuration to hq.json with relative path
    if (fs.existsSync('hq.json')) {
        fs.unlinkSync('hq.json')
    }

    fs.writeFileSync('hq.json', JSON.stringify(config, null, 2))
    spinner.succeed('Configuration saved to hq.json')

    // Wait for the installation to complete before proceeding
    spinner.succeed('Installation complete.')

    const continuedToAddComponent = spawn('npx hq-kit add', { stdio: 'inherit', shell: true })

    await new Promise<void>((resolve) => {
        continuedToAddComponent.on('close', () => {
            resolve()
        })
    })

    console.log(chalk.blueBright('========================'))
    console.log('||  Happy coding!  🔥 ||')
    console.log(chalk.blueBright('========================'))

    spinner.stop()
}
