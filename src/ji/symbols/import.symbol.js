import { contextFolder, contextMaker } from './set.symbol'

export const importSymbol = async (left, right) => async (state) => {
  const isLiteral = left === '!'

  const foldedContext = contextFolder(state.context)
  const madeContext = contextMaker(state.context)
  const res = await Function(`${madeContext}\n return ${right}`)
    .bind({ ...foldedContext })()

  const { transport } = res
  const currentSymbols = Object.keys(state.vocabulary)
  const newSymbols = !!transport &&
        !!transport.vocabulary &&
        Object.entries(transport.vocabulary)
          .filter(([symbol]) => currentSymbols.indexOf(symbol) === -1)

  const addSymbols = newSymbols.reduce((acc, [symbol, fn]) => ({ ...acc, [symbol]: fn }), {})
  const output = isLiteral
    ? `${state.output}\nNew symbols: ${newSymbols.map(([e]) => e).join(', ')}\n`
    : state.output
  const collected = ''
  return newSymbols.length > 0
    ? { ...state, vocabulary: { ...state.vocabulary, ...addSymbols }, output, collected }
    : { ...state, output, collected }
}

export default importSymbol
