const rootUrl = 'https://raw.githubusercontent.com/hq-kit/ui/main';

const getRepoUrlForComponent = (componentName: string) => {
  const repoUrl = `${rootUrl}/components/ui/${componentName}.tsx`;
  return repoUrl;
};

const cssSource = `${rootUrl}/lib/styles/default.css`;
const utilsSource = `${rootUrl}/lib/utils/index.ts`;
const hooksSource = `${rootUrl}/lib/hooks/index.ts`;

type Component = {
  section: string;
  name: string;
  deps?: string[];
  children?: Component[];
};

async function fetchComponentList(): Promise<Component[]> {
  const response = await fetch(
    `${rootUrl}/components/docs/generated/components.json`,
  );
  const data = await response.text();
  const components = JSON.parse(data);
  return components;
}

export {
  cssSource,
  utilsSource,
  hooksSource,
  getRepoUrlForComponent,
  fetchComponentList,
  type Component,
};
