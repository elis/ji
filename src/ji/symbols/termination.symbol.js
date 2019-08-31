import marks from '../marks'

export const terminationSymbol = (left) => async (state) => {
  const { vocabulary = {}, collected = '', output = '' } = state
  const pending = [...(state.pending || [])]

  if (pending.length > 0) {
    const pend = pending.pop()
    const pendfn = vocabulary[pend.el]
    const expectsLines = pendfn.length >= 3

    if (expectsLines) {
      return {
        ...state,
        pending: [...pending, pend],
        collected: `${collected}\n`
      }
    }

    const pres = await pendfn(pend.left, collected)

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
          output: `${result.output}${pressedState}${marks.ts}`,
          collected: '',
          pending: [...pending]
        }
        return stredOutput
      }
      return pressedState
    }

    return {
      ...state,
      output: `${state.output}${pres}${marks.ts}`,
      collected: '',
      pending: [...pending]
    }
  }

  const resultingOutput = `${output}${left}${marks.ts}`

  return {
    ...state,
    output: resultingOutput,
    collected: ''
  }
}

export default terminationSymbol
