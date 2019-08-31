exports.command = ['watch <filename> [scope]']

exports.describe = 'compile ji file on change'

exports.handler = async function (argv) {
  const fs = require('fs')
  const path = require('path')
  const { filename, scope } = argv
  const { compile, readFile } = require('./compile')

  const scopePath = scope && path.join(process.cwd(), scope)
  const filePath = path.join(process.cwd(), filename)
  
  const changeHandler = async () => {
    const data = await readFile(filePath)
    const _scope = (scopePath && fs.existsSync(scopePath))
      ? require(path.join(process.cwd(), scope))
      : {}

    const compiled = await compile(data, _scope)
    process.stdout.write(compiled.toString())
  }

  fs.watchFile(filePath, changeHandler)
  
  if (scopePath && fs.existsSync(scopePath)) {
    fs.watchFile(scopePath, () => {
      delete require.cache[require.resolve(scopePath)]
      changeHandler()
    })
  }

  changeHandler()
}
