#!/usr/bin/env node

/* eslint-disable no-unused-expressions */
require('yargs')
  .scriptName('ji')
  .usage('$0 [filename] [scope]')
  .commandDir('../cmd')
  .option('parse', {
    alias: ['p', 'input'],
    describe: 'Compile a given string'
  })
  .middleware(require('../cmd/middleware/stdin.js').middleware)
  .middleware(require('../cmd/middleware/filename-helper.js').middleware, true)
  .demandCommand()
  .showHelpOnFail(false, 'Specify --help for available options')
  .help()
  .argv
