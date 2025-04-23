const rootUrl = 'https://raw.githubusercontent.com/hq-kit/ui/main';

const getRepoUrlForComponent = (componentName: string) => {
  const repoUrl = `${rootUrl}/components/ui/${componentName}.tsx`;
  return repoUrl;
};

const cssSource = `${rootUrl}/lib/styles/app.css`;
const utilsSource = `${rootUrl}/lib/utils/index.ts`;
const hooksSource = `${rootUrl}/lib/hooks/index.ts`;

export { cssSource, utilsSource, hooksSource, getRepoUrlForComponent };
