import { fold } from '../utils'



const symbolist = (vocabulary, template) =>
  fold(listSymbols(template), [], Object.entries(vocabulary))

const listSymbols = template => (output, [symbol, fn]) =>
  ([
    ...output,

    (template && typeof template === 'function')
      ? template(symbol, fn)
      : `${symbol.replace('\n', '\\n').replace(' ', "' '")} — dec: ${symbol.codePointAt(0)}`
  ])

export const vocabularySymbol = async (left, right) => state => {
  if (right) {
    const symbol = right
    const fn = state.vocabulary[symbol]
    return `<h3>${symbol.replace('\n', '\\n')} — dec: ${symbol.codePointAt(0)}</h3>

<pre style='padding-left: 2rem; border: 1px solid rgba(0,0,0,0.1)'>${fn.toString()}</pre>`

  }
  if (left === '!') {
    const tpl = (symbol, fn) => `<h4>${symbol.replace('\n', '\\n')} — dec: ${symbol.codePointAt(0)}</h4>

<pre style='padding-left: 2rem; border: 1px solid rgba(0,0,0,0.1)'>${fn.toString()}</pre>`

    const symbols = symbolist(state.vocabulary, tpl)
    console.log('symbols results:', symbols)
    const advanced = `
### Current Vocabulary

${symbols.join('\n')}
`
    return advanced
  }
  const symbols = symbolist(state.vocabulary)
  const plain = `### Current vocabulary:\n\n${symbols.map(el => `#### ${el}`).join('\n\n')}`

  return plain
}

export default vocabularySymbol
