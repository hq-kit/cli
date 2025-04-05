import { spawn } from 'child_process'
import ora from 'ora'

export const additionalDeps = async (componentName: string, packageManager: string, action: string) => {
    const dependencies: Record<string, string> = {
        toast: 'sonner',
        progress: 'motion',
        meter: 'motion',
        otp: 'input-otp',
        chart: 'recharts',
        carousel: 'embla-carousel-react embla-carousel-autoplay',
        command: 'cmdk',
        'rich-text-field': 'lexical @lexical/react',
    }

    const dependency = dependencies[componentName]

    if (dependency) {
        const spinner = ora(`Creating...`).start()
        const installCommand = `${packageManager} ${action} ${dependency}`
        const child = spawn(installCommand, {
            stdio: 'ignore',
            shell: true,
        })

        await new Promise<void>((resolve) => {
            child.on('close', () => {
                spinner.stop()
                resolve()
            })
        })
    }
}
