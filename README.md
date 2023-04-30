# **highrise-js-sdk**
<p align="center">
  <img src="https://i.ibb.co/d0vtV49/highrise-logo.png" alt="highrise-logo" />
</p>

> **The Highrise JS SDK is a JavaScript library for writing and running Highrise bots.**

## **⚙️ Installation** 
```
npm i highrise-js-sdk@latest
```

## **✨ Features**

- Easy to use.
- Beginner friendly.
- Auto reconnect system.
- Supports Node version 10+

## **📚 Usage**
```js
const { Highrise } = require("highrise-js-sdk")
const bot = new Highrise(token, roomId);

bot.on('ready', (client) => {
    console.log(`The bot is now online: ${client}`)
});
```

