import typescript from 'rollup-plugin-typescript2'

const tsPlugin = typescript({
  clean: true,
  tsconfig: 'tsconfig.json',
  useTsconfigDeclarationDir: true
})

const nodePlugins = [
  require('@rollup/plugin-node-resolve')({
    preferBuiltins: true
  }),
  require('@rollup/plugin-commonjs')({
    sourceMap: false
  })
]

export default {
  input: 'src/index.ts',
  output: { file: 'lib/web-crawler.cjs.js', format: 'cjs' },
  plugins: [tsPlugin, ...nodePlugins]
}
