const config = require("./config");
const services = require("./services");
const TelegramBot = require("node-telegram-bot-api");
const utilities = require("./utilities");
const db = require("./database");
const messages = require("./messages");

telegram = new TelegramBot(config.TELEGRAM_BOT_TOKEN, { polling: true });

telegram.on("text", ({ from, chat, text }) => {
  const user = utilities.getUserName(from);
  const { id } = from;

  const ref = db.ref(`/users/${id}`);
  ref.once("value", snapshot => {
    if (snapshot.val()) {
      if (text.startsWith("/start")) {
        telegram.sendMessage(chat.id, `Welcome back ${user}!`);
      } else if (text.startsWith("/stock")) {
        services.getCurrencyValues().then(({ data }) => {
          telegram.sendMessage(chat.id, ...messages.stockMessage(data));
        });
      } else if (text.startsWith("/buy")) {
        const [cmd, symbol, amount] = text.split(" ");
        if (!utilities.checkSyntax(text)) {
          telegram.sendMessage(chat.id, ...messages.buyInvalidSyntax);
        } else if (!utilities.checkSymbol(symbol)) {
          telegram.sendMessage(chat.id, ...messages.missingSymbol);
        } else {
          services.getCurrencyValue(symbol).then(({ data }) => {
            const [{ price_usd }] = data;
            const { balance } = snapshot.val().cash;
            if (price_usd * amount <= balance) {
              ref.update(
                utilities.getBuyCoinUpdateValue(snapshot.val(), data, amount),
                () => {
                  telegram.sendMessage(
                    chat.id,
                    ...messages.buySuccessMessage(amount, symbol)
                  );
                }
              );
            } else {
              telegram.sendMessage(
                chat.id,
                ...messages.buyNotEnoughFunds(
                  utilities.moduloDivision(balance, price_usd),
                  symbol
                )
              );
            }
          });
        }
      } else if (text.startsWith("/wallet")) {
        telegram.sendMessage(
          chat.id,
          ...messages.walletMessage(snapshot.val())
        );
      } else if (text.startsWith("/help")) {
        telegram.sendMessage(chat.id, ...messages.helpMessage);
      }
    } else {
      if (text.startsWith("/start")) {
        services.setInitialBalance(from);
        telegram.sendMessage(chat.id, ...messages.welcomeMessage(user));
      } else {
        telegram.sendMessage(chat.id, ...messages.missingUser(user));
      }
    }
  });
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
