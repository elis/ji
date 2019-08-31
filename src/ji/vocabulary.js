
export const vocaReducer = async (state, el) => {
  const { vocabulary = {}, pending = [] } = state
  const lastWord = state.collected && (state.collected || '').split(' ').pop()
  const word = lastWord && `${lastWord}${el}`

  const isSymbol = vocabulary[el]
  const isWord = !!word && vocabulary[word]

  const collected = ((!isSymbol && isWord)
    ? (state.collected || '').replace(lastWord, '')
    : state.collected) || ''
  
  const sym = vocabulary[el]
    ? vocabulary[el]
    : (word && vocabulary[word]
      ? vocabulary[word]
      : false
    )

  if (sym) {
    if (typeof sym === 'function') {
      // 🏭 Symbol is function

      const { vocabulary: localVoca = {} } = sym
      const voca = {
        ...vocabulary,
        ...localVoca
      }

      const usesLeft = sym.length >= 1
      const expectsRight = sym.length >= 2
      // const expectsMultiline = sym.length >= 3
      // const shortTermination = !!sym.shortTerminator

      const left = (isWord && !isSymbol)
        ? (collected || (state.output || '').split('\n').pop()).replace(lastWord, '')
        : collected

      if (expectsRight) {
        const pend = {
          shortTermination: sym.shortTerminator,
          state: { ...state },
          left,
          el: isSymbol ? el : word
        }

        pending.push(pend)
        return {
          ...state,
          collected: '',
          vocabulary: voca,
          pending: [...pending]
        }
      } else {
        const res = usesLeft ? await sym(left) : await sym()
        if (typeof res === 'function') {
          const exe = await res(state)

          if (typeof exe === 'string') {
            return {
              ...state,
              collected: '',
              output: `${state.output}${!usesLeft ? left : ''}${exe}`
            }
          } else if (!exe) {
            return {
              ...state,
              collected: `${state.collected || ''}${el}`
            }
          }
          return exe
        }
        return {
          ...state,
          collected: '',
          output: `${state.output}${!usesLeft ? left : ''}${res}`
        }
      }
    } else {
      const coll = (!isSymbol && isWord)
        ? collected.replace(lastWord, '')
        : collected
      const newState = {
        ...state,
        collected: '',
        output: `${state.output}${coll}${sym}`
      }
      return newState
    }
  }



  return {
    ...state,
    collected: `${collected}${el}`
  }
}

export default vocaReducer
