import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";
import { babel } from '@rollup/plugin-babel'

import pkg from './package.json';

export default [
  {
    input: './src/index.ts',
    output: [
      {
        name: 'window',
        extend: true,
        file: pkg.browser,
        format: 'umd',
        sourcemap: true,
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        },
      },
      {
          file: pkg.main,
          format: "cjs",
          sourcemap: true,
      },
      {
          file: pkg.module,
          format: "esm",
          sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      terser(),
      typescript({
        // useTsconfigDeclarationDir: true,
        typescript: require('typescript'),
      }),
      // babel({
      //   babelrc: false,
      //   extensions: ['.ts'],
      //   presets: [
      //     [
      //       '@babel/preset-env',
      //       {
      //         modules: false,
      //         targets: {
      //           browsers: ['last 2 versions', 'ie >= 11'],
      //         },
      //       },
      //     ],
      //   ],
      // }),
    ],
    external: ["react", "react-dom", "meilisearch"]
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts()],
  },
];