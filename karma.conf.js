module.exports = function(config) {
  config.set({

    basePath : './',

    files : [
      'lib/angular.js',
      'lib/turnBasedServices.4.js',
      'ts_output_readonly_do_NOT_change_manually/src/game.js',
      'ts_output_readonly_do_NOT_change_manually/src/gameLogic.js',
      'ts_output_readonly_do_NOT_change_manually/src/aiService.js',
      'ts_output_readonly_do_NOT_change_manually/src/gameLogic_test.js',
      'ts_output_readonly_do_NOT_change_manually/src/aiService_test.js'
    ],

    reporters: ['progress', 'coverage'],

    preprocessors: {
      // Source files, that you wanna generate coverage for.
      // (these files will be instrumented by Istanbul)
      // Do not include tests or libraries.
      'ts_output_readonly_do_NOT_change_manually/src/gameLogic.js': ['coverage'],
      'ts_output_readonly_do_NOT_change_manually/src/aiService.js': ['coverage']
    },

    // optionally, configure the reporter
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    browserConsoleLogOptions: {
      level: "log", 
      format: "%b %T: %m", 
      terminal: true
    },

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
            ],
    
    // This is the new content for your travis-ci configuration test
    //  Custom launcher for Travis-CI
    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true 
  });

  if(process.env.TRAVIS){
      config.browsers = ['Chrome_travis_ci'];
  }
};
