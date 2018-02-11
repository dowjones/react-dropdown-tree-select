import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'
import sizes from 'rollup-plugin-sizes'
import visualizer from 'rollup-plugin-visualizer'

import pkg from './package.json'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM'
}

const external = ['react', 'react-dom']

const plugins = [
  postcss({
    extensions: [ '.css' ],
    extract: true,
    minimize: true
  }),
  resolve({
    jsnext: true,
    main: true,
    browser: true,
    customResolveOptions: {
      moduleDirectory: 'node_modules'
    }
  }),
  babel({
    exclude: ['node_modules/**']
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  commonjs(),
  uglify({
    compress: {
      dead_code: true,
      warnings: false
    }
  }),
  sizes({
    details: true
  }),
  visualizer({
    sourcemap: true,
    filename: './dist/report.html'
  })
]

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      format: 'umd',
      name: 'ReactDropdownTreeSelect',
      file: pkg.browser,
      globals,
      sourcemap: true
    },
    plugins,
    external
  }

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
//   {
//     input: 'src/index.js',
//     external: external,
//     output: [
//       { file: pkg.main, format: 'cjs', globals: globals }
//       // { file: pkg.module, format: 'es', globals: globals }
//     ],
//     plugins: [
//       postcss({
//         extensions: [ '.css' ],
//         extract: true
//       }),
//       resolve(),
//       babel({
//         exclude: ['node_modules/**']
//       })
//     ]
//   }
]
