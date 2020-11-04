import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import { config } from "dotenv";
import replace from "@rollup/plugin-replace";

const production = !process.env.ROLLUP_WATCH;
const { API_URL, TWILIO_PHONE, CLIENT_URL } = process.env;

function serve() {
   let server;

   function toExit() {
      if (server) server.kill(0);
   }

   return {
      writeBundle() {
         if (server) return;
         server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
            stdio: ["ignore", "inherit", "inherit"],
            shell: true,
         });

         process.on("SIGTERM", toExit);
         process.on("exit", toExit);
      },
   };
}

export default {
   input: "src/main.js",
   output: {
      sourcemap: true,
      format: "iife",
      name: "app",
      file: "public/build/bundle.js",
   },
   plugins: [
      svelte({
         // enable run-time checks when not in production
         dev: !production,
         // we'll extract any component CSS out into
         // a separate file - better for performance
         css: (css) => {
            css.write("bundle.css");
         },
      }),
      replace({
         // stringify the object
         __myapp: JSON.stringify({
            env: {
               isProd: production,
               API_URL,
               CLIENT_URL,
               TWILIO_PHONE,
               ...config().parsed, // attached the .env config
            },
         }),
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration -
      // consult the documentation for details:
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
         browser: true,
         preferBuiltins: false,
         dedupe: ["svelte"],
      }),
      json(),
      commonjs(),

      // In dev mode, call `npm run start` once
      // the bundle has been generated
      !production && serve(),

      // Watch the `public` directory and refresh the
      // browser on changes when not in production
      !production && livereload("public"),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
   ],
   watch: {
      clearScreen: false,
   },
};
