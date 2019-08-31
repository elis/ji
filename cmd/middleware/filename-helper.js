exports.middleware = (argv) => {
  const fs = require('fs')
  const { filename } = argv
  const q = /.*\.ji$/g
  
  if (q.test(filename) && fs.existsSync(filename)) {
    return {}
  }

  if (fs.existsSync(filename + '.ji')) {
    return { filename: `${filename}.ji` }
  }

  if (fs.existsSync(filename + '/index.ji')) {
    return { filename: `${filename}/index.ji` }
  }

  return {}
}

