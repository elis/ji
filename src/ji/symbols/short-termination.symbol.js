import marks from '../marks'

export const shortTermination = (left) => async (state) => {
  const { vocabulary = {}, collected = '' } = state
  const pending = [...(state.pending || [])]

  if (pending.length > 0) {
    const pend = pending.pop()
    const symbol = vocabulary[pend.el]
    const { shortTerminator } = symbol

    if (symbol && shortTerminator) {
      const pres = await symbol(pend.left, collected)

      if (typeof pres === 'function') {
        const expectsPend = pres.length >= 2
        const result = {
          ...state,
          pending: [...pending]
        }
        if (expectsPend) {
          return {
            ...result,
            collected: '\n',
            pending: [
              ...pending,
              pend
            ]
          }
        }
        const pressedState = await pres({ ...result, pending })
        if (typeof pressedState === 'string' || isFinite(pressedState)) {
          const stredOutput = {
            ...result,
            output: `${result.output}${pressedState}`,
            collected: '',
            pending: [...pending]
          }
          return stredOutput
        }
        return pressedState
      }
      return 'NOT RETURNED PROPERLY'
    }
  }

  return {
    ...state,
    collected: `${state.collected || ''}${marks.shortTerminator}`
  }
}

export default shortTermination
