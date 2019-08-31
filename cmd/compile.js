exports.command = ['compile [filename] [scope]', '$0 [filename] [scope]']

exports.describe = 'compile ji code'

exports.handler = async function (argv) {
  const fs = require('fs')
  const path = require('path')
  const { filename, scope, input } = argv

  const compile = (str) => {
    const _scope = {
      r: (what) => require(what),
      ...((scope && fs.existsSync(scope)) ? require(path.join(process.cwd(), scope)) : {})
    }

    return require('../dist').ji(str, _scope)
  }

  if (filename) {
    const data = await new Promise(resolve => fs.readFile(path.join(process.cwd(), filename), 'utf8', (err, d) => {
      if (err) {
        process.stderr.write(err.toString())
      }
      resolve(d)
    }))
    const compiled = await compile(data)
    process.stdout.write(compiled.toString())
  } else if (input) {
    const compiled = await compile(input)
    process.stdout.write(compiled.toString())
  } else {
    require('yargs').showHelp()
  }
}
