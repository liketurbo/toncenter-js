import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/my-library.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/my-library.esm.js",
      format: "esm",
    },
    {
      file: "dist/my-library.umd.js",
      format: "umd",
      name: "toncenter",
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    json(),
  ],
};
