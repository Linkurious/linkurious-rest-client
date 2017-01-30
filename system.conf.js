System.config({
  defaultJSExtensions : false,
  transpiler : 'babel',
  paths: {
    'plugin-babel': 'node_modules/systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'node_modules/systemjs-plugin-babel/systemjs-babel-browser.js',
    "superagent": "node_modules/superagent/superagent.js",
    "typescript" : "node_modules/typescript/lib/typescript.js",
    "systemjs" : "node_modules/systemjs/dist/system.js",
    "system-polyfills" : "node_modules/systemjs/dist/system-polyfills.js",
    "es6-module-loader" : "node_modules/es6-module-loader/dist/es6-module-loader.js"
  }
});