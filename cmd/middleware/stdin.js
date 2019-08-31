process.stdin.setEncoding('utf8')

const getInput = async () => {
  const waitingInput = new Promise(resolve => {
    process.stdin.resume()
    let input = ''
    process.stdin.on('data', (chunk) => { input += chunk })
    setTimeout(() => {
      process.stdin.destroy()
      resolve(input)
    }, 5)
  })

  const input = await waitingInput

  return input
}

exports.middleware = async (argv) => {
  const input = await getInput(argv)
  return input ? { input } : {}
}
