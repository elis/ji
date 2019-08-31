# Ji

Ji is a programming language that uses symbols as functions

## Usage

### CLI

Using [npx](https://github.com/npm/npx):

```bash
$ npx jilc -p "My first Ji!"
# My first Ji!

$ echo "Get started with Ji:
¿" > my.ji

$ npx jilc watch my.ji
# Get started with...

```

Install locally:

```bash
$ npm i -g jilc

$ echo "Get started with Ji:
¿" > myfile.ji

$ ji watch myfile
# Get started with...
```

Provide javascript scope:

```bash
# create myscope.js
$ echo "exports.timenow = () => (new Date()).toString() }" > myscope.js

# create scoped.ji
$ echo "Test scope
@ ⨕ timenow
Time now is: @" > scoped.ji

$ ji scoped myscope.js
# Test scope
# Time now is: Sat Aug 31 2019 17:26:23 GMT+0300 (Israel Daylight Time)
```

## Module

Use Ji inside your javascript code:

```bash
$ npm install --save jilc
```

```js
const Ji = require('jilc')

const input = `Testing my Ji skills
ƒ ⨕ (left) => parseFloat(left) + 33

100ƒ
`

const compiled = Ji.ji(input)
console.log(compiled.toString())
// Testing my Ji skills
//
// 133
```

## Learn more

Get started here: [https://observablehq.com/@elisk/ji-language](https://observablehq.com/@elisk/ji-language)
## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)