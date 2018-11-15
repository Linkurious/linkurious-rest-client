// Karma configuration
// Generated on Wed Jun 08 2016 15:30:52 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['systemjs', 'jasmine'],

    plugins : [
      'karma-systemjs',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-mocha-reporter',
      'karma-clear-screen-reporter'
    ],


    // list of files / patterns to load in the browser
    files: [
      'tempTests/test/index_spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],

    systemjs: {
      configFile: 'system.conf.js',
      config : {
        baseURL : '.',
        paths : {
          "systemjs" : "node_modules/systemjs/dist/system.js",
          "system-polyfills" : "node_modules/systemjs/dist/system-polyfills.js",
          "es6-module-loader" : "node_modules/es6-module-loader/dist/es6-module-loader.js"
        },
        packages : {
          'dist' : {
            defaultExtension : 'js'
          },
          'test' : {
            defaultExtension:'js'
          },
          '' : {
            defaultExtension : 'js'
          },
        }
      },
      serveFiles: [
        'node_modules/superagent/superagent.js',
        'tempTests/index.js',
        'tempTests/src/**/*.js',
        'tempTests/test/*.js'
      ]
    },
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DISABLE,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1
  })
};
