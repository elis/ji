exports.command = ['compile [filename] [scope]', '$0 [filename] [scope]']

exports.describe = 'compile ji code'

exports.handler = async function (argv) {
  const path = require('path')
  const { filename, scope, input } = argv

  const scopePath = scope && path.join(process.cwd(), scope)
  const filePath = filename && path.join(process.cwd(), filename)

  const _scope = (scopePath && require('fs').existsSync(scopePath))
    ? require(path.join(process.cwd(), scope))
    : {}

  if (filename) {
    const data = await readFile(filePath)
    const compiled = await compile(data, _scope)
    process.stdout.write(compiled.toString())
  } else if (input) {
    const compiled = await compile(input, _scope)
    process.stdout.write(compiled.toString())
  } else {
    require('yargs').showHelp()
  }
}

const compile = exports.compile = (str, scope = {}) => {
  const _scope = {
    r: (what) => require(what),
    ...(scope || {})
  }

  return require('../dist').ji(str, _scope)
}

const readFile = exports.readFile = async (filepath) => 
  new Promise(resolve => require('fs').readFile(filepath, 'utf8', (err, d) => {
    if (err) {
      process.stderr.write(err.toString())
    }
    resolve(d)
  }))
