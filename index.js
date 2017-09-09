const config = require("./config");
const services = require("./services");
const TelegramBot = require("node-telegram-bot-api");
const utilities = require("./utilities");

telegram = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

telegram.on("text", ({ from, chat }) => {
  const user = utilities.getUserName(from);
  telegram.sendMessage(
    chat.id,
    `Привет ${user}, иди-ка ты пока что в жопу наверно`
  );
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
