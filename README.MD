# Zigerion Bot for Telegram

Cryptocurrency stock emulator for your favorite chat messenger. 
Click here to start: [@zigerion_bot](https://t.me/zigerion_bot/)

### Setting up environment
1. Install npm dependencies
2. Register a new Telegram bot using [@BotFather](https://t.me/BotFather/)
3. Create file `./config.js` with following code
```
module.exports = {
  TELEGRAM_BOT_TOKEN: "TELEGRAM-API-KEY",
  CRYPTO_API_URL: "https://api.coinmarketcap.com/v1/ticker/"  
};
```
4. Register a free Firebase account and generate _Service Account Key_ file
5. Rename it to `./firebase-service-account.json` and place into the root of your app
6. Replace your database url in `./database.js` file

### Running the bot
`npm index` to start the bot

### Running unit tests
`jest --watch` tro run unit tests suites 

#### Technologies and libraries used

- [Node.js Telegram Bot API](https://github.com/yagop/node-telegram-bot-api)
- [Firebase Admin SDK for Server](https://firebase.google.com/docs/admin/setup)
- [Firebase Realtime firebase](https://firebase.google.com/docs/database/web/start)

#### Hosting
- [Heroku](https://devcenter.heroku.com/categories/nodejs)

#### Utilities
- [Ramda](http://ramdajs.com/docs/)
- [Axios](https://github.com/mzabriskie/axios)
- [Moment.js](https://momentjs.com/docs/)

#### Unit Tests
- [Jest](https://facebook.github.io/jest/docs/en/getting-started.html)
- [Chai](http://chaijs.com/api/)
- [Sinon](http://sinonjs.org/releases/v3.3.0/)


