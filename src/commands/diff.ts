import { checkbox } from '@inquirer/prompts'
import chalk from 'chalk'
import { diffLines } from 'diff'
import fs from 'fs'
import fetch from 'node-fetch'
import path from 'path'
import { isNextJs, isTypescript } from '../utils/helpers'
import { getRepoUrlForComponent } from '../utils/repo'
import { transformTsxToJsx } from '../utils/transform-jsx'

const getLocalComponentPath = (configPath: string, componentName: string) => {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    return isTypescript() ? path.join(config.ui, `${componentName}.tsx`) : path.join(config.ui, `${componentName}.jsx`)
}

const fetchRemoteComponent = async (componentName: string): Promise<string> => {
    const url = getRepoUrlForComponent(componentName)
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch component: ${response.statusText}`)
    let content = await response.text()
    content = isTypescript() ? content : await transformTsxToJsx({ content, writePath: '' })
    content = !isNextJs() ? content : content.replace(/['"]use client['"]\s*\n?/g, '')
    return content
}

const compareComponents = (localContent: string, remoteContent: string) => {
    const diff = diffLines(localContent, remoteContent)
    return diff.filter((part) => part.added || part.removed)
}

export const diff = async (...args: string[]) => {
    try {
        const configPath = path.resolve(process.cwd(), 'hq.json')
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        const componentsDir = config.ui

        const excludeComponents = ['index']

        let componentNames = fs
            .readdirSync(componentsDir)
            .filter((file) => file.endsWith('.tsx') || file.endsWith('.jsx'))
            .map((file) => (file.endsWith('.tsx') ? path.basename(file, '.tsx') : path.basename(file, '.jsx')))
            .filter((name) => !excludeComponents.includes(name))

        if (args.length > 0) {
            componentNames = componentNames.filter((name) => args.includes(name))
        }

        const changedComponents: string[] = []

        for (const componentName of componentNames) {
            const localComponentPath = getLocalComponentPath(configPath, componentName)
            const localContent = fs.readFileSync(localComponentPath, 'utf-8')

            try {
                const remoteContent = await fetchRemoteComponent(componentName)
                const diffs = compareComponents(localContent, remoteContent)

                if (diffs.length > 0) {
                    console.log(`Differences found in ${componentName}:`)
                    diffs.forEach((part) => {
                        const symbol = part.added ? '+' : '-'
                        const colorFn = part.added ? chalk.green : chalk.red
                        process.stdout.write(
                            part.value
                                .split('\n')
                                .map((line) => colorFn(`${symbol} ${line}`))
                                .join('\n'),
                        )
                    })
                    console.log('\n')
                    changedComponents.push(componentName)
                } else {
                    console.log(`${chalk.green(`✔ ${componentName}`)} is up to date.`)
                }
            } catch (error: any) {
                // Skip the component if it's not found
            }
        }

        if (changedComponents.length > 0) {
            const selectedComponents = await checkbox({
                message: 'Select components to update',
                choices: [
                    ...changedComponents.map((componentName) => ({
                        title: componentName,
                        value: componentName,
                    })),
                ],
                // @ts-expect-error - initial is not a valid option for checkbox
                initial: changedComponents,
            })

            if (selectedComponents.includes('none') || selectedComponents.length === 0) {
                console.log('No components selected for update.')
                return
            }

            for (const componentName of selectedComponents) {
                try {
                    const remoteContent = await fetchRemoteComponent(componentName)
                    const localComponentPath = getLocalComponentPath(configPath, componentName)
                    fs.writeFileSync(localComponentPath, remoteContent)
                    console.log(`${chalk.green(`✔ ${componentName} is updated.`)}`)
                } catch (error: any) {
                    console.error(`Error updating ${componentName}: ${error.message}`)
                }
            }
        } else {
            console.log(chalk.green('✔ All components are up to date.'))
        }
    } catch (error: any) {
        console.error('Error checking differences:', error.message)
    }
}
