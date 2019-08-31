import _ from 'lodash'
import { fold } from '../utils'
import marks from '../marks'

const setSymbol = (() => {
  const fn = async (left, right) => async (state) => {
    const foldedContext = contextFolder(state.context)
    const madeContext = contextMaker(state.context)
    const res = await Function(`${madeContext}\n return ${right}`)
      .bind({ ...foldedContext })()

    return {
      ...state,
      collected: '',
      vocabulary: {
        ...state.vocabulary,
        [_.trim(left)]: res
      }
    }
  }

  fn.vocabulary = {
    [marks.blockStart]: blockBeginSymbol
  }
  return fn
})()


export const blockEndSymbol = (left) => (state) => {
  const { pending } = state
  const pend = pending.pop()

  const str = `${pend.left}${pend.el}${left}}`

  Object.entries(state.vocabulary)
    .filter(([sym]) => sym !== marks.blockStart)
    .filter(([sym]) => sym !== marks.blockEnd)

  return {
    ...state,
    collected: `${str}`,
    pending
  }
}

export const blockBeginSymbol = (left, right, lines) => (state, lines) => {
  // const vocabulary = Object.entries(state.vocabulary).filter(([sym]) => sym !== marks.blockStart)
  return {
    ...state,
    collected: `${left}{`
  }
}

blockBeginSymbol.vocabulary = {
  [marks.blockEnd]: blockEndSymbol
}


export const contextMaker = context => fold(contextMakerReducer, [], context).join('\n')
export const contextMakerReducer = (context, item) => [...context, `const ${item[0]} = this.${item[0]}\n`]
export const contextFolder = (context) => fold(contextReducer, {}, context)
export const contextReducer = (context, item) => Object.assign(context, { [item[0]]: item[1] })

export default setSymbol
