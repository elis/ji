import _ from 'lodash'
import runes from 'runes'

const verbos = false
const log = symbols => (...rest) => verbos && console.log(...symbols, ...rest)

export const jit = async (...rest) => {
  // const compiled = await jitc()(...rest)
  // const marked = md`${compiled}`
  // const { transport } = compiled
  const jitranslate = vocs => async (...newRest) => {
    const kompiled = await jitc(vocs)(...newRest)
    const mded = `${kompiled}`
    
    Object.assign(mded, {
      plain: kompiled,
      transport: { ...kompiled.transport },
      jitranslate: jitranslate(kompiled.transport.vocabulary),
      toString: () => kompiled.transport.output
    })
    return mded
  }
  // Object.assign(marked, {
  //   plain: compiled,
  //   transport,
  //   jitranslate: jitranslate(compiled.transport.vocabulary),
  //   toString: () => compiled.transport.output
  // })
  
  return jitranslate()(...rest)
}

const jitc = vocas => async (input, ...params) => {
  if (input && input.length) {
    const len = input.length
    
    const prep = []
    const context = []
    
    for (let i = 0; i < input.length; ++i) {
      const inp = input[i]
      const par = (params || [])[i]
      
      prep.push(inp)
      if (par) {
        if (typeof par === 'string') {
          prep.push(par)
        }
        else if (par instanceof Array) {
          context.push(par)
          prep.push(par[0])
        }
      }
    }
    
    const text = prep.join('')
    
    const compiled = await jic(text, {...baseVoca, ...(vocas || {})}, context)
    const output = compiled.output
    console.log('what is output?', compiled)
    const assigned = Object.assign(output, { transport: compiled })
    return assigned
  }
}

const jic = (() => {
  const { trim } = _
  // const verbos = true
  const counts = {}
  
  // console.clear()
  log`🚀`('BEGIN')
  log`🚀`('Verbosity', verbos)
  
  const jireducer = async (state, el) => {
    const { vocabulary } = state
    
    const vocabulate = async (item) => {
      const t = await waitfold(vocaReducer, state, [item])
      return t
    }
    
    Object.assign(counts, {reducer: (counts.reducer || 0) + 1})
    Object.assign(counts, {jitReducer: (counts.jitReducer || 0) + 1})
    log`🚀❇️`('\n\n\n', counts.jitReducer, '\n\n')
    log`🚀🚈`('JIREDUCER', `!${el.codePointAt(0)}`, {el}, {state})
    
    const voced = await vocabulate(el)
    
    log`🚀🚈`('voced:', voced)
    log`🚀🚈`('reducing', {state, el})

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
  
  const compiler = async (input, vocabulary = baseVoca, context) =>
    await waitfold(jireducer, { vocabulary, input, context }, runes(input + "\n"))
  
  return (...rest) => {
    Object.assign(counts, {jitReducer: 0})
    
    return compiler(...rest)
  }
})()

const vocaReducer = async (state, el) => {
  const { vocabulary = {}, pending = [] } = state
  const lastWord = state.collected && (state.collected || '').split(' ').pop()
  const word = lastWord && `${lastWord}${el}`
  
  const isSymbol = vocabulary[el]
  const isWord = !!word && vocabulary[word]
  
  const collected = ((!isSymbol && isWord)
    ? (state.collected || '').replace(lastWord, '')
    : state.collected) || ''
  
  log`🎙`('\n\n\n\nReducing', el, {
    collected, lastWord, word,
    isSymbol, isWord
  })
  
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
      const expectsMultiline = sym.length >= 3
      const shortTermination = !!sym.shortTerminator
      
      const left = (isWord && !isSymbol)
        ? (collected || (state.output || '').split('\n').pop()).replace(lastWord, '')
        : collected
      log`🎙`('SYMBOL IS SHORT TERMINATION', shortTermination ? 'YES ✅' : 'NO ❌')
      
      log`🎙`('Symbol is Function', {
        usesLeft,
        expectsRight,
        expectsMultiline,
        collected,
        left,
        shortTermination
      })
      
      
      if (expectsRight) {
        const pend = {
          shortTermination: sym.shortTerminator,
          state: { ...state },
          left,
          el: isSymbol ? el : word
        }
        log`🎙🔜`('Expects right, adding pend:', {pend})
        
        pending.push(pend)
        return {
          ...state,
          collected: '',
          vocabulary: voca,
          pending: [ ...pending ]
        }
      } else {
        log`🎙`('Doesnt expects right', {left})
        const res = usesLeft ? await sym(left) : await sym()
        log`🎙`('Result', {res})
        if (typeof res === 'function') {
          const exe = await res(state)
          log`🎙`('Executed result', {exe})
          
          if (typeof exe === 'string') {
            return {
              ...state,
              collected: '',
              output: `${state.output}${!usesLeft ? left : ''}${exe}`
            }
          }
          else if (!exe) {
            return {
              ...state,
              collected: `${state.collected || ''}${el}`
            }
          }
          return exe
        }
        if (verbos) console.log('result of sett:', res)
        return {
          ...state,
          collected: '',
          output: `${state.output}${!usesLeft ? left : ''}${res}`
        }
      }
    }

    else {
      log`🎙`('Symbol is not function', {sym})
      const coll = (!isSymbol && isWord)
        ? collected.replace(lastWord, '')
        : collected
      const newState = {
        ...state,
        collected: ``,
        output: `${state.output}${coll}${sym}`
      }
      log`🎙`('New state:', {newState})
      return newState
    }
  }



  return {
    ...state,
    collected: `${collected}${el}`
  }
}

 // Like the normal `fold` function but with added async/await functionality to play nice with Observable's environment
 const waitfold = async (reducer, init, xs) => {
  let acc = init
  for (const x of xs) {
    acc = await reducer(acc, x)
  }
  return acc
}

console.log('This is test')

const marks = {
  ts: '\n', // Termination symbol
  shortTerminator: ' ', // Short Termination Symbol
  blockStart: '{',
  blockEnd: '}'
}


const blockBeginSymbol = (() => {
  const fn = (left, right, lines) => (state, lines) => {
    const vocabulary = Object.entries(state.vocabulary).filter(([sym]) => sym !== marks.blockStart)
    return {
      ...state,
      collected: `${left}{`
    }
  }
  
  fn.vocabulary = {
    [marks.blockEnd]: blockEndSymbol
  }
  
  return fn
})

const blockEndSymbol = (left) => (state) => {
  const { pending } = state
  const pend = pending.pop()
  
  const str = `${pend.left}${pend.el}${left}}`
  
  const vocabulary = Object.entries(state.vocabulary)
    .filter(([sym]) => sym !== marks.blockStart)
    .filter(([sym]) => sym !== marks.blockEnd)
  
  return {
    ...state,
    collected: `${str}`,
    pending
  }
}


const importSymbol = async (left, right) => async (state) => {
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
  
  const addSymbols = newSymbols.reduce((acc, [symbol, fn]) => ({...acc, [symbol]: fn}), {})
  const output = isLiteral
    ? `${state.output}\nNew symbols: ${newSymbols.map(([e]) => e).join(', ')}\n`
    : state.output
  const collected = ''
  return newSymbols.length > 0
    ? { ...state, vocabulary: { ...state.vocabulary, ...addSymbols }, output, collected }
    : { ...state, output, collected }
}

const vocabularySymbol = (() => {
  const symbolist = (vocabulary, template) =>
    fold(listSymbols(template), [], Object.entries(vocabulary))
 
  const listSymbols = template => (output, [symbol, fn]) => 
    ([
      ...output,
      
      (template && typeof template === 'function')
      ? template(symbol, fn)
      :`${symbol.replace('\n', '\\n').replace(' ', "' '")} — dec: ${symbol.codePointAt(0)}`
    ])
  
  const fn = async (left, right) => state => {
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
  
  return fn
})()


const terminationSymbol = (left) => async (state) => {
  const { vocabulary = {}, collected = '', output = '' } = state
  const pending = [...(state.pending || [])]
  log`🍯`('TERMINATOR', {'pending.length': pending.length, state, collected, left})
  
  if (pending.length > 0) {
    const pend = pending.pop()
    const pendfn = vocabulary[pend.el]
    const expectsLines = pendfn.length >= 3
    log`🍯`('Pending', {pend, pendfn, expectsLines})

    if (expectsLines) {
      return {
        ...state,
        pending: [ ...pending, pend ],
        collected: `${collected}\n`
      }
    }
    
    const pres = await pendfn(pend.left, collected)
    log`🍯`('Pending execution result', pres)
    
    if (typeof pres === 'function') {
      const expectsPend = pres.length >= 2
      const result = {
        ...state,
        pending: [ ...pending ]
      }

      if (expectsPend) {
        return {
          ...result,
          collected: `\n`,
          pending: [
            ...pending,
            pend
          ]
        }
      }
      const pressedState = await pres({ ...result, pending })
      if (typeof pressedState === 'string' || _.isNumber(pressedState)) {
        const stredOutput = {
          ...result,
          output: `${result.output}${pressedState}${marks.ts}`,
          collected: '',
          pending: [ ...pending ]
        }
        return stredOutput
      }
      return pressedState
    }
    
    return {
      ...state,
      output: `${state.output}${pres}${marks.ts}`,
      collected: '',
      pending: [ ...pending ]
    }
  }
    
  const resultingOutput = `${output}${left}${marks.ts}`
    
  log`🍯🍷`('Output', {output, resultingOutput})
  return {
    ...state,
    output: resultingOutput,
    collected: ''
  }
}

const shortTerminationSymbol = (() => {
  const fn = (left) => async (state) => {
    const { vocabulary = {}, collected = '', output = '' } = state
    const pending = [...(state.pending || [])]
    log`🛋`('Short Terminator', {pendincgLength: pending.length, state, collected, left})
    
    if (pending.length > 0) {
      const pend = pending.pop()
      const symbol = vocabulary[pend.el]
      const { shortTerminator } = symbol
      log`🛋🧪`('Short termination:', symbol.shortTerminator)
      
      if (symbol && shortTerminator) {
        const pres = await symbol(pend.left, collected)

        if (typeof pres === 'function') {
          const expectsPend = pres.length >= 2
          const result = {
            ...state,
            pending: [ ...pending ]
          }
          if (expectsPend) {
            return {
              ...result,
              collected: `\n`,
              pending: [
                ...pending,
                pend
              ]
            }
          }
          const pressedState = await pres({ ...result, pending })
          if (typeof pressedState === 'string' || _.isNumber(pressedState)) {
            const stredOutput = {
              ...result,
              output: `${result.output}${pressedState}`,
              collected: '',
              pending: [ ...pending ]
            }
            return stredOutput
          }
          return pressedState
        }
        if (verbos) console.log('Pending FN:', {symbol, pres})
        return 'NOT RETURNED PROPERLY'
      }
    }

    return {
      ...state,
      collected: `${state.collected || ''}${marks.shortTerminator}`
    }
  }
  
  return fn
})()

const setSymbol = (() => {
  const fn = async (left, right) => async (state) => {
    log`🔶🔸`('Set Symbol', {left, right}, {source: `return ${right}`})

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

const setWordSymbol = (() => {
  const fn = async (left, right) => async state => {
    
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
          log`🔋🧼`('EXPECT RIGHT')
          resWrapper = fn => (left, right) => {
            const lefts = left.split(' ')
            const rights = right.split(' ')
            const resLeft = lefts.pop()
            const resRight = rights.shift()
            log`🔋🧼`('resWrapper execution', { left, right, lefts, rights, resLeft, resRight})

            const response = fn(resLeft, resRight)
            log`🔋🧼`('resWrapper execution response', { response })

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
                collected: `${([...lefts]).join(' ')} ${response} ${[...rights].join(' ')}`,
              })
            }

            return response
          }
        }
        else {
          resWrapper = fn => (left) => {
            log`🔋`('Res wrapper for left only')
            const lefts = left.split(' ')
            const resLeft = lefts.pop()
            log`🔋`('lefts, resLeft', {lefts, resLeft})

            const response = fn(resLeft)

            if (typeof response === 'function') {
              console.log('DO SOMETHING HERE')
            } else {
              const lefti = ([...lefts]).join(' ')
              const lefto = lefti.replace(resLeft, response)
              
              return `${left.replace(resLeft, '')}${response}`
            }
            return response
          }
        }
      }
      else {
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
    }
    else {
      Object.assign(res, { shortTerminator: true })
      
      // Not function
      log`🔶🔸`('NOT A FUNCTION', {left, state, collected: state.collected, res, str: res.toString()})
      return {
        ...state,
        collected: '',
        vocabulary: {
          ...state.vocabulary,
          [_.trim(left)]: res
        }
      }
    }
    
    return {
      ...state
    }
  }
  
  fn.vocabulary = {
    [marks.blockStart]: blockBeginSymbol
  }
  return fn
})

const contextMaker = context => fold(contextMakerReducer, [], context).join('\n')
const contextMakerReducer = (context, item) => [...context, `const ${item[0]} = this.${item[0]}\n`]
const contextFolder = (context) => fold(contextReducer, {}, context)
const contextReducer = (context, item) => Object.assign(context, { [ item[0] ]: item[1] })

 // Array folding
// https://dev.to/mebble/learn-to-fold-your-js-arrays-2o8p
const fold = (reducer, init, xs) => {
  let acc = init
  for (const x of xs) {
    acc = reducer(acc, x)
  }
  return acc
}


const baseVoca = {
  // Termination
  // hex: 000A
  // dec: 10
  '\n': terminationSymbol,

  // Short Termination
  // hex: 0020
  // dec: 32
  ' ': shortTerminationSymbol,

  // Set
  // hex: 2A0E
  // dec: 10766
  '⨎': setSymbol,

  // Set Word
  // hex: 2A15
  // dec: 10773
  '⨕': setWordSymbol,

  // Vocabulary
  '¿': vocabularySymbol,

  // hex: 2A2D
  '⨭': importSymbol
}
