import runes from 'runes'
import _ from 'lodash'
import { waitfold } from './utils'
import { ts } from './marks'
import vocaReducer from './vocabulary'
import baseVoca from './base.vocab'

const compiler = (input, vocabulary = baseVoca, context) =>
  waitfold(jireducer, { vocabulary, input, context }, runes(input + ts))

const jireducer = async (state, el) => {
  // const { vocabulary } = state

  const vocabulate = async (item) => {
    const t = await waitfold(vocaReducer, state, [item])
    return t
  }

  const voced = await vocabulate(el)

  if (_.isNumber(voced) || typeof voced === 'string') {
    return {
      ...state,
      output: `${state.output}${voced}`
    }
  }
  return {
    ...voced
  }
}
export const jic = (...rest) => {
  // Object.assign(counts, {jitReducer: 0})

  return compiler(...rest)
}

export default jic
