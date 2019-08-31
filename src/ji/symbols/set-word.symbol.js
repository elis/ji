import _ from 'lodash'
import marks from '../marks'
import { contextFolder, contextMaker, blockBeginSymbol } from './set.symbol'

export const setWordSymbol = async (left, right) => async state => {
  const foldedContext = contextFolder(state.context)
  const madeContext = contextMaker(state.context)
  const res = await Function(`${madeContext}\n return ${right}`)
    .bind({ ...foldedContext })()

  if (typeof res === 'function') {
    let resWrapper
    const expectsLeft = res.length >= 1
    const expectsRight = res.length >= 2

    if (expectsLeft) {
      if (expectsRight) {
        resWrapper = fn => (left, right) => {
          const lefts = left.split(' ')
          const rights = right.split(' ')
          const resLeft = lefts.pop()
          const resRight = rights.shift()

          const response = fn(resLeft, resRight)

          if (typeof response === 'function') {
            return async state => {
              const sresponse = await response(state)

              if (_.isString(sresponse) || _.isNumber(sresponse)) {
                return `${([...lefts]).join(' ')} ${sresponse} ${[...rights].join(' ')}`
              }
              return sresponse
            }
          } else {
            return state => ({
              ...state,
              collected: `${([...lefts]).join(' ')} ${response} ${[...rights].join(' ')}`
            })
          }
        }
      } else {
        resWrapper = fn => (left) => {
          const lefts = left.split(' ')
          const resLeft = lefts.pop()

          const response = fn(resLeft)

          if (typeof response === 'function') {
            console.log('DO SOMETHING HERE')
          } else {
            // const lefti = ([...lefts]).join(' ')
            // const lefto = lefti.replace(resLeft, response)

            return `${left.replace(resLeft, '')}${response}`
          }
          return response
        }
      }
    } else {
      resWrapper = fn => () => {
        const response = fn()

        return response
      }
    }

    const symbol = resWrapper(res)
    symbol.shortTerminator = true

    return {
      ...state,
      collected: '',
      vocabulary: {
        ...state.vocabulary,
        [_.trim(left)]: symbol
      }
    }
  } else {
    Object.assign(res, { shortTerminator: true })

    // Not function
    return {
      ...state,
      collected: '',
      vocabulary: {
        ...state.vocabulary,
        [_.trim(left)]: res
      }
    }
  }
}

setWordSymbol.vocabulary = {
  [marks.blockStart]: blockBeginSymbol
}

export default setWordSymbol
