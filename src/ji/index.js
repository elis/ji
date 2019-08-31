
import baseVocab from './base.vocab'
import jic from './jic'

export const ji = async (input, scope) => {
  return jitranslate(null, scope)(input)
}

export const jit = async (...rest) => {
  return jitranslate()(...rest)
}

const jitranslate = (vocs, scope) => async (...newRest) => {
  const compiled = await jitc(vocs, scope)(...newRest)
  const mded = {} // md`${compiled}`
  
  Object.assign(mded, {
    plain: compiled,
    transport: { ...compiled.transport },
    jitranslate: jitranslate(compiled.transport.vocabulary),
    toString: () => compiled.transport.output
  })

  return mded
}


const jitc = (vocas, scope = {}) => async (input, ...params) => {
  if (input && input.length) {
    // const len = input.length

    const prep = []
    const context = []

    for (let i = 0; i < input.length; ++i) {
      const inp = input[i]
      const par = (params || [])[i]

      prep.push(inp)
      if (par) {
        if (typeof par === 'string') {
          prep.push(par)
        } else if (par instanceof Array) {
          context.push(par)
          prep.push(par[0])
        }
      }
    }

    Object.entries(scope || {}).map((el) => context.push(el))

    const text = prep.join('')

    const compiled = await jic(text, { ...baseVocab, ...(vocas || {}) }, context)
    const output = compiled.output
    const assigned = Object.assign(output, { transport: compiled })
    return assigned
  }
}

export default ji
