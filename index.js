const config = require("./config");
const TelegramBot = require("node-telegram-bot-api");
const db = require("./database");
const http = require("http");
const Zigerion = require("./zigerion");

telegram = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

telegram.on("text", message => {
  const { id } = message.from;
  const { text } = message;
  if (text.startsWith("/")) {
    const ref = db.ref(`/users/${id}`);
    ref.once("value", snapshot => {
      const zigerion = new Zigerion(message, snapshot, telegram);
      if (!zigerion.user) {
        zigerion.handleMissingUser();
      }
      zigerion.processMessage();
    });
  }
});

const server = http.createServer();
server.listen(process.env.PORT || 5000);
