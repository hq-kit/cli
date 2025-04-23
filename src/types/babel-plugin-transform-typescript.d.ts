declare module '@babel/plugin-transform-typescript' {
  import type { PluginObj } from '@babel/core';

  interface PluginOptions {
    allowDeclareFields?: boolean;
    allowNamespaces?: boolean;
    disallowAmbiguousJSXLike?: boolean;
    isTSX?: boolean;
    onlyRemoveTypeImports?: boolean;
    optimizeConstEnums?: boolean;
  }

  // Default export is a function that returns a Babel plugin object
  export default function transformTypeScript(
    options?: PluginOptions,
  ): PluginObj;
}
