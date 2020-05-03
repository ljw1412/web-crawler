import typescript from 'rollup-plugin-typescript2'
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

export default {
  input: 'src/index.ts',
  output: { file: 'lib/web-crawler.cjs.js', format: 'cjs' },
  plugins: [json(), tsPlugin, ...nodePlugins]
}
