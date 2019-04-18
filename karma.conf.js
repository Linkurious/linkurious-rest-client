// Karma configuration
// Generated on Mon Feb 11 2019 13:45:28 GMT+0100 (CET)

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'karma-typescript'],

    karmaTypescriptConfig: {
      bundlerOptions: {
        transforms: [require('karma-typescript-es6-transform')()],
      },
    },

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'index.ts' },
      { pattern: 'src/*.ts' },
      { pattern: 'src/**/*.ts' },
      { pattern: 'test/*_spec.ts' },
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'index.ts': ['karma-typescript', 'coverage'],
      './src/*.ts': ['karma-typescript', 'coverage'],
      './src/**/*.ts': ['karma-typescript', 'coverage'],
      './test/*_spec.ts': ['karma-typescript'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'karma-typescript'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

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
    concurrency: Infinity,
  });
};
