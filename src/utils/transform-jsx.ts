import { transformFromAstSync } from '@babel/core'
import { ParserOptions, parse } from '@babel/parser'
// @ts-expect-error unknown-import
import transformTypescript from '@babel/plugin-transform-typescript'
import { promises as fs } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import * as recast from 'recast'
import { Project, ScriptKind } from 'ts-morph'

const PARSE_OPTIONS: ParserOptions = {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    startLine: 1,
    tokens: true,
    plugins: [
        'asyncGenerators',
        'bigInt',
        'classPrivateMethods',
        'classPrivateProperties',
        'classProperties',
        'classStaticBlock',
        'decimal',
        'decorators-legacy',
        'doExpressions',
        'dynamicImport',
        'exportDefaultFrom',
        'exportNamespaceFrom',
        'functionBind',
        'functionSent',
        'importAssertions',
        'importMeta',
        'nullishCoalescingOperator',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining',
        [
            'pipelineOperator',
            {
                proposal: 'minimal',
            },
        ],
        [
            'recordAndTuple',
            {
                syntaxType: 'hash',
            },
        ],
        'throwExpressions',
        'topLevelAwait',
        'v8intrinsic',
        'typescript',
        'jsx',
    ],
}

const transformJsx = async ({ sourceFile }: { sourceFile: any }) => {
    const output = sourceFile.getFullText()

    const ast = recast.parse(output, {
        parser: {
            parse: (code: string) => {
                return parse(code, PARSE_OPTIONS)
            },
        },
    })

    const result = transformFromAstSync(ast, output, {
        cloneInputAst: false,
        code: false,
        ast: true,
        plugins: [transformTypescript],
        configFile: false,
    })
    if (!result || !result.ast) {
        throw new Error('Failed to transform JSX')
    }
    return recast.print(result.ast).code
}

const project = new Project({
    compilerOptions: {},
})

async function createTempSourceFile(filename: string) {
    const dir = await fs.mkdtemp(path.join(tmpdir(), 'hq-'))
    return path.join(dir, filename)
}

async function getSourceFile({ content, writePath }: { content: string; writePath: string }) {
    const tempFile = await createTempSourceFile(writePath)
    const sourceFile = project.createSourceFile(tempFile, content, {
        scriptKind: ScriptKind.TSX,
    })
    return sourceFile
}

export async function transformTsxToJsx({ content, writePath }: { content: string; writePath: string }) {
    const sourceFile = await getSourceFile({ content, writePath })
    const result = await transformJsx({ sourceFile })
    return result
}
