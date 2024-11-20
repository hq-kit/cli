#!/usr/bin/env node

import { program } from 'commander'
import packageJson from '../package.json'
import { add } from './commands/add'
import { diff } from './commands/diff'
import { help } from './commands/help'
import { init } from './commands/init'

const version = packageJson.version

const args = process.argv.slice(2)
if (args.includes('--version') || args.includes('-v')) {
    console.log(packageJson.version)
    process.exit(0)
}

program.version(version, '-v, --version', 'Output the version number').description('CLI Tool Description')

program.command('init').option('--skip <type>', 'Skip a specific step').action(init)

program
    .command('add [components...]')
    .option('--skip <type>', 'Skip')
    .option('-o, --override', 'Override existing components')
    .action(async (components, options) => {
        await add({ component: components.join(' '), ...options })
    })

program
    .command('diff [components...]')
    .description('Show differences between local and remote components')
    .action(async (components) => {
        await diff(...components)
    })

help(program)

program.parse(process.argv)
