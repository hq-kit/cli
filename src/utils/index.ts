import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { getUIPathFromConfig, isNextJs, isTypescript } from './helpers'
import { transformTsxToJsx } from './transform-jsx'

export function getWriteComponentPath(componentName: string): string {
    const uiFolder = getUIPathFromConfig()
    return path.join(uiFolder, `${componentName}.tsx`)
}

export async function writeFile(url: string, writePath: string) {
    try {
        const response = await fetch(url)
        let content = await response.text()
        content = isTypescript() ? content : await transformTsxToJsx({ content, writePath })
        content = isNextJs() ? content : content.replace(/['"]use client['"]\s*\n?/g, '')

        if (!isTypescript()) {
            writePath = writePath.replace(/\.tsx$/, '.jsx')
            writePath = writePath.replace(/\.ts$/, '.js')
        }

        fs.writeFileSync(writePath, content)
    } catch (error: any) {
        console.error(chalk.red(`Error writing component to ${writePath}: ${error.message}`))
    }
}

export function writeExports() {
    const uiFolder = getUIPathFromConfig()
    const componentsAdded = fs.readdirSync(uiFolder)
    const exports = componentsAdded
        .filter((componentName) => !componentName.endsWith('.ts'))
        .map((componentName) => `export * from './${componentName.replace('.tsx', '').replace('.jsx', '')}';`)
        .join('\n')
    const indexFilePath = isTypescript() ? path.join(uiFolder, 'index.ts') : path.join(uiFolder, 'index.js')
    fs.writeFileSync(indexFilePath, exports)
    console.log(chalk.green(`✔ ${componentsAdded.length - 1} components added to index`))
}
