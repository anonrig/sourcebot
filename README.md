![SourceBot Framework](https://avatars0.githubusercontent.com/u/21346235?v=3&s=200)

SourceBot
==

[![npm](https://img.shields.io/npm/v/sourcebot.svg)](https://www.npmjs.com/package/sourcebot)
[![David](https://img.shields.io/david/sourcebot/sourcebot.svg)](https://david-dm.org/sourcebot/sourcebot)
[![npm](https://img.shields.io/npm/l/sourcebot.svg)](https://spdx.org/licenses/MIT)

SourceBot is a platform independent chat bot framework. It aims to connect Facebook Messenger, Slack and Skype with the same code.

Benefits of SourceKit:
- Uses EcmaScript 6 Class architecture.
- Easily debuggable.
- Uses Promises, catches uncaught exceptions on the way.

In order to install:

```
npm install sourcebot --save
```

In order to debug (Example):
```
DEBUG=* node index.js
```

Example:

```javascript
let SlackCore = require('sourcebot');
let SlackBot = new SlackCore({
  token: 'xoxb-17065016470-0O9T0P9zSuMVEG8yM6QTGAIB'
});


SlackBot
  .connect()
  .then((bot) => {
    bot
      .listen('hello', (response) => {
        bot.send({
          channel: response.channel,
          text: 'world'
        });
      })
  })
  .catch((err) => console.error(err.message))
```

The MIT License
===
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
