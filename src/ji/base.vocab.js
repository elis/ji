import terminationSymbol from './symbols/termination.symbol'
import shortTerminationSymbol from './symbols/short-termination.symbol'
import setSymbol from './symbols/set.symbol'
import setWordSymbol from './symbols/set-word.symbol'
import vocabularySymbol from './symbols/vocabulary.symbol'
import importSymbol from './symbols/import.symbol'


const vocabulary = {
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

export default vocabulary
