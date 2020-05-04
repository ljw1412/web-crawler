import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'

const tsPlugin = typescript({
  clean: true,
  tsconfig: 'tsconfig.rollup.json',
  useTsconfigDeclarationDir: true,
  tsconfigOverride: { exclude: ['project/**/*.ts'] }
})

const nodePlugins = [
  require('@rollup/plugin-node-resolve')({
    preferBuiltins: true,
    browser: true
  }),
  require('@rollup/plugin-commonjs')({
    sourceMap: false
  })
]

const minifyPlugin = terser({
  include: [/^.+\.min\.js$/, '*esm*'],
  output: {
    comments: false
  }
})

export default {
  input: 'src/index.ts',
  output: [
    { file: 'lib/web-crawler.js', format: 'cjs' },
    { file: 'lib/web-crawler.min.js', format: 'cjs' },
    { file: 'lib/web-crawler.esm.js', format: 'esm' }
  ],
  plugins: [json(), tsPlugin, ...nodePlugins, minifyPlugin],
  external: ['cheerio']
}
