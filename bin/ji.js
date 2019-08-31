#!/usr/bin/env node

// console.log('STD IN:', process.stdin)
// const pipe = require('pipe-args').load(['input'])


// require('../cmd/middleware/stdin.js').otherwise(() => {
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
  // Add normalizeCredentials to yargs
    // .command(
    //   'watch [filename]',
    //   'execute a ji file'
    // )
    // .command(['compile [filename]', '$0 [filename]'], 'compile ji file', () => {}, (argv) => {
    //   console.log('this command will be run by default')

    //   console.log('argv:', argv)
    // })
    .showHelpOnFail(false, 'Specify --help for available options')
    .help()
    .argv
// })

/*
const fs = require('fs')
const process = require('process')
const path = require('path')
const Ji = require('../dist')
const { ji } = Ji

const { filename, _: [arg0, arg1] } = argv

const cwd = process.cwd()
const scoping = path.join(process.cwd(), arg1)

const compileFile = filename => {
  fs.readFile(filename, 'UTF-8', (err, content) => {
    const scope = { r: (what) => require(what) }
    if (arg1 && fs.existsSync(scoping)) {
      Object.assign(scope, require(scoping))
    }
    if (!err) {
      ji(content, scope)
        .then(compiled => {
          console.log(compiled.toString())
        })
    }
  })
}

if (filename) {
  const filepath = path.join(cwd, filename)
  if (fs.existsSync(filepath)) {
    fs.watch(filepath, () => {
      compileFile(filepath)
    })
    if (arg1 && fs.existsSync(scoping)) {
      fs.watch(filepath, () => {
        compileFile(filepath)
      })
    }
    compileFile(filepath)
  } else {
    console.error(`Filename ${filepath} is not unaccessible`)
  }
} else if (arg0 && fs.existsSync(arg0)) {
  compileFile(arg0)
}

*/
