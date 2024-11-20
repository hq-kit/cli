export const getRepoUrlForComponent = (componentName: string) => {
    const repoUrl = `https://raw.githubusercontent.com/hq-kit/ui/main/components/ui/${componentName}.tsx`
    if (!repoUrl) {
        throw new Error('REPO_URL environment variable is not set')
    }
    return repoUrl
}
