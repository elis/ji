

// Array folding
// https://dev.to/mebble/learn-to-fold-your-js-arrays-2o8p
export const fold = (reducer, init, xs) => {
  let acc = init
  for (const x of xs) {
    acc = reducer(acc, x)
  }
  return acc
}

// Like the normal `fold` function but with added async/await functionality to play nice with Observable's environment
export const waitfold = async (reducer, init, xs) => {
  let acc = init
  for (const x of xs) {
    acc = await reducer(acc, x)
  }
  return acc
}
