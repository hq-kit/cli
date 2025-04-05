import chalk from 'chalk'
import fs from 'fs'
import { existsSync } from 'node:fs'
import path from 'path'

export function hasFolder(folderName: string): boolean {
    const folderPath = path.join(process.cwd(), folderName)
    return fs.existsSync(folderPath)
}

export function possibilityCssPath(): string {
    if (isLaravel()) {
        return 'resources/css/app.css'
    } else if (isNextJs() && hasFolder('src')) {
        return 'src/app/globals.css'
    } else if (isNextJs() && !hasFolder('src')) {
        return 'app/globals.css'
    } else if (isRemix()) {
        return 'app/tailwind.css'
    } else if (isVite()) {
        return 'src/index.css'
    }
    return 'src/index.css'
}

export function possibilityComponentsPath(): string {
    if (isLaravel()) {
        return 'resources/js/components'
    } else if (isNextJs() && hasFolder('src')) {
        return 'src/components'
    } else if (isNextJs() && !hasFolder('src')) {
        return 'components'
    } else if (isRemix()) {
        return 'app/components'
    } else if (isVite()) {
        return 'src/components'
    }
    return 'components'
}

export function possibilityRootPath(): string {
    if (isLaravel()) {
        return 'resources/js'
    } else if (isNextJs() && hasFolder('src')) {
        return 'src'
    } else if (isNextJs() && !hasFolder('src')) {
        return ''
    } else if (isRemix()) {
        return 'app'
    } else if (isVite()) {
        return 'src'
    }
    return ''
}

export function possibilityLibPath(): string {
    if (isLaravel()) {
        return 'resources/js/lib'
    } else if (isNextJs() && hasFolder('src')) {
        return 'src/lib'
    } else if (isNextJs() && !hasFolder('src')) {
        return 'lib'
    } else if (isRemix()) {
        return 'lib'
    } else if (isVite()) {
        return 'src/lib'
    }
    return 'lib'
}

export function tailwindConfigPath(): string {
    if (isLaravel()) {
        return 'postcss.config.mjs'
    } else if (isNextJs() && hasFolder('src')) {
        return 'src/config/hq.json'
    } else if (isNextJs() && !hasFolder('src')) {
        return 'config/hq.json'
    } else if (isRemix()) {
        return 'config/hq.json'
    } else if (isVite()) {
        return 'src/config/hq.json'
    }
    return 'config/hq.json'
}

export function isNextJs(): boolean {
    return fs.existsSync('next.config.ts') || fs.existsSync('next.config.js') || fs.existsSync('next.config.mjs')
}

export function isRemix(): boolean {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
        const { dependencies = {}, devDependencies = {} } = packageJson
        return '@remix-run/react' in dependencies || '@remix-run/react' in devDependencies
    }
    return false
}

export function isLaravel(): boolean {
    return fs.existsSync(path.resolve(process.cwd(), 'artisan'))
}

export function isVite(): boolean {
    return fs.existsSync('vite.config.ts') || fs.existsSync('vite.config.js')
}

export function isTypescript(): boolean {
    return fs.existsSync(path.resolve(process.cwd(), 'tsconfig.json'))
}

export function getUIPathFromConfig() {
    const configFile = path.join(process.cwd(), 'hq.json')
    if (!fs.existsSync(configFile)) {
        console.error(
            `${chalk.red('hq.json not found')}. ${chalk.gray(`Please run ${chalk.blue('npx hq-kit@latest init')} to initialize the project.`)}`,
        )
        return
    }
    const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
    return config.ui || possibilityComponentsPath() + '/ui'
}

export function getAliasFromConfig() {
    const configFilePath = path.join(process.cwd(), 'hq.json')
    if (!fs.existsSync(configFilePath)) {
        throw new Error('hq.json not found. Please initialize the project.')
    }
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'))
    return config.alias
}

export const hqConfigFile = path.resolve(process.cwd(), 'hq.json')
