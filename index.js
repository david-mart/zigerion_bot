const config = require("./config");
const services = require("./services");
const TelegramBot = require("node-telegram-bot-api");
const utilities = require("./utilities");
const db = require("./database");
const messages = require("./messages");

telegram = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

telegram.on("text", ({ from, chat, text }) => {
  const user = utilities.getUserName(from);
  const { username } = from;

  if (text.startsWith("/start")) {
    const ref = db.ref(`/users/${username}`);
    ref.once("value", snapshot => {
      if (snapshot.val()) {
        telegram.sendMessage(chat.id, `Welcome back ${user}!`);
      } else {
        services.setInitialBalance(username);
        telegram.sendMessage(chat.id, ...messages.welcomeMessage(user));
      }
    });
  } else if (text.startsWith("/stock")) {
    services.getCurrencyValues().then(({ data }) => {
      telegram.sendMessage(chat.id, ...messages.stockMessage(data));
    });
  } else if (text.startsWith("/buy")) {
    const [cmd, symbol, amount] = text;
    const ref = db.ref(`/users/${username}`);
    ref.once("value", snapshot => {
      if (snapshot.val()) {
        telegram.sendMessage(chat.id, `Welcome back ${user}!`);
      } else {
        telegram.sendMessage(chat.id, ...messages.missingUser(user));
      }
    });
  }
});

telegram.on("inline_query", query => {
  // console.log(query);
  // telegram.answerInlineQuery(query.id, [
  //   {
  //     type: "article",
  //     id: "wallet",
  //     title: "My Wallet",
  //     input_message_content: {
  //       message_text: "You're broke, loser"
  //     }
  //   },
  //   {
  //     type: "article",
  //     id: "currency_list",
  //     title: "Crypto Currency price list",
  //     input_message_content: {
  //       message_text: "Fuck you bitch"
  //     }
  //   }
  // ]);
});
