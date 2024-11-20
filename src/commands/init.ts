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
    possibilityComponentsPath,
    possibilityCssPath,
    possibilityLibPath,
} from '../utils/helpers'
import { transformTsxToJsx } from '../utils/transform-jsx'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const resourceDir = path.resolve(__dirname, '../src/resources')
const stubs = path.resolve(__dirname, '../src/resources/stubs')

export async function init() {
    const tailwindConfigExists = fs.existsSync('tailwind.config.js') || fs.existsSync('tailwind.config.ts')
    if (!tailwindConfigExists) {
        const packageManager = await getPackageManager()
        const action = packageManager === 'npm' ? 'i' : 'add'
        const installCommand = `${packageManager} ${action} tailwindcss postcss autoprefixer -D
        npx tailwindcss init ${isRemix() && '--ts'} -p`

        const child = spawn(installCommand, {
            stdio: 'inherit',
            shell: true,
        })

        await new Promise<void>((resolve) => {
            child.on('close', () => {
                resolve()
            })
        })
    }

    let componentFolder: string,
        uiFolder: string,
        cssLocation: string,
        tailwindSource: string,
        providers: string,
        libFolder: string

    componentFolder = await input({
        message: 'Enter the path to your components folder:',
        default: possibilityComponentsPath(),
        validate: (value) => value.trim() !== '' || 'Path cannot be empty. Please enter a valid path.',
    })

    uiFolder = path.join(componentFolder, 'ui')

    libFolder = await input({
        message: 'Enter the path to your lib/utils folder:',
        default: possibilityLibPath(),
        validate: (value) => value.trim() !== '' || 'Path cannot be empty. Please enter a valid path.',
    })

    cssLocation = await input({
        message: 'Where would you like to place the CSS file?',
        default: possibilityCssPath(),
        validate: (value) => value.trim() !== '' || 'Path cannot be empty. Please enter a valid path.',
    })

    const utilsSourceFile = isTypescript() ? path.join(stubs, 'utils.stub') : path.join(stubs, 'utils-js.stub')
    if (isNextJs()) {
        tailwindSource = path.join(stubs, 'next/tailwind.config.stub')
        providers = path.join(stubs, 'next/providers.stub')
    } else if (isLaravel()) {
        tailwindSource = path.join(stubs, 'laravel/tailwind.config.stub')
        providers = path.join(stubs, 'laravel/providers.stub')
    } else if (isRemix()) {
        tailwindSource = path.join(stubs, 'remix/tailwind.config.stub')
        providers = path.join(stubs, 'remix/providers.stub')
    } else {
        tailwindSource = path.join(stubs, 'vite/tailwind.config.stub')
        providers = path.join(stubs, 'vite/providers.stub')
    }

    if (!fs.existsSync(libFolder)) {
        fs.mkdirSync(libFolder, { recursive: true })
    }

    if (!fs.existsSync(uiFolder)) {
        fs.mkdirSync(uiFolder, { recursive: true })
    }

    const config = {
        $schema: 'https://hq-kit.vercel.app',
        ui: uiFolder,
        lib: libFolder,
        css: cssLocation,
    }

    const spinner = ora(`Initializing HQ...`).start()

    const tailwindConfigTarget = fs.existsSync('tailwind.config.js') ? 'tailwind.config.js' : 'tailwind.config.ts'
    try {
        const tailwindConfigContent = fs.readFileSync(tailwindSource, 'utf8')
        fs.writeFileSync(tailwindConfigTarget, tailwindConfigContent, { flag: 'w' })
    } catch (error) {
        spinner.fail(`Failed to write Tailwind config to ${tailwindConfigTarget}`)
    }

    // Handle CSS file placement (always overwrite)
    const cssSourcePath = path.join(resourceDir, 'theme/app.css')
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
    let mainPackages = ['react-aria-components', 'hq-icons'].join(' ')
    let devPackages = [
        'tailwindcss-react-aria-components',
        'tailwind-variants',
        'tailwind-merge',
        'clsx',
        'tailwindcss-animate',
    ].join(' ')

    if (isNextJs()) {
        devPackages += ' next-themes'
    }

    if (isRemix()) {
        devPackages += ' remix-themes'
    }

    if (isTypescript()) {
        devPackages += ' @types/node @types/react @types/react-dom'
    }

    const action = packageManager === 'npm' ? 'i' : 'add'
    const installCommand = `${packageManager} ${action} ${mainPackages} && ${packageManager} ${action} -D ${devPackages}`

    spinner.info(`Installing dependencies...`)

    const child = spawn(installCommand, {
        stdio: 'inherit',
        shell: true,
    })

    await new Promise<void>((resolve) => {
        child.on('close', () => {
            resolve()
        })
    })

    const utilsContent = fs.readFileSync(utilsSourceFile, 'utf8')
    if (!fs.existsSync(libFolder)) {
        fs.mkdirSync(libFolder, { recursive: true })
        spinner.succeed(`Created lib folder at ${libFolder}`)
    }

    if (isTypescript()) {
        fs.writeFileSync(path.join(libFolder, 'utils.ts'), utilsContent, { flag: 'w' })
    } else {
        fs.writeFileSync(path.join(libFolder, 'utils.js'), utilsContent, { flag: 'w' })
    }
    spinner.succeed(`utils file copied to ${libFolder}`)

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

    const continuedToAddComponent = spawn('npx hq-kit add', {
        stdio: 'inherit',
        shell: true,
    })

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
