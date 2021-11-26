# twpipe

[![Build status](https://img.shields.io/travis/余聪/twpipe/master.svg?style=flat-square)](https://travis-ci.com/余聪/twpipe)
[![Test coverage](https://img.shields.io/codecov/c/github/余聪/twpipe.svg?style=flat-square)](https://codecov.io/github/余聪/twpipe?branch=master)
[![NPM version](https://img.shields.io/npm/v/twpipe.svg?style=flat-square)](https://www.npmjs.com/package/twpipe)
[![NPM Downloads](https://img.shields.io/npm/dm/twpipe.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/twpipe)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

> Two-way communication (with pending queue, timeout features)
> for iframe / web worker / ...

## Installation

```bash
npm install twpipe
# or use yarn
yarn add twpipe
```

## Usage

- `worker.js`

```javascript
import { createPipeB } from 'twpipe'

const pipe = createPipeB(
  self,
  {
    worker: (a, b) => {
      return Promise.resolve(a + b)
    }
  },
  'xx-worker'
)

pipe.main('main').then(console.log) // => main
```

- `main.js`

```javascript
import { createPipe } from 'twpipe'
const worker = new Worker('./worker.js')

const pipe = createPipe(
  worker,
  {
    main: () => 'main'
  },
  'xx-worker'
)

pipe.rpc('worker', 1, 2).then(console.log) // => 3
pipe.rpc('404') // throw error async
```

## Contributing

- Fork it!
- Create your new branch:  
  `git checkout -b feature-new` or `git checkout -b fix-which-bug`
- Start your magic work now
- Make sure npm test passes
- Commit your changes:  
  `git commit -am 'feat: some description (close #123)'` or `git commit -am 'fix: some description (fix #123)'`
- Push to the branch: `git push`
- Submit a pull request :)

## Authors

This library is written and maintained by 余聪, <a href="mailto:yucong@yuanfudao.com">yucong@yuanfudao.com</a>.

## License

MIT - [余聪](https://github.com/余聪) 🐟
