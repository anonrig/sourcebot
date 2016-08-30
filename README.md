SourceBot
==

SourceBot is a platform independent chat bot platform.

In order to install:

```
npm install sourcebot --save
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
