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
      // if (snapshot.val()) {
      //     if (text.startsWith("/start")) {
      //       telegram.sendMessage(chat.id, `Welcome back ${user}!`);
      //     } else if (text.startsWith("/stock")) {
      //       services.getCurrencyValues().then(({ data }) => {
      //         telegram.sendMessage(chat.id, ...messages.stockMessage(data));
      //       });
      //     } else if (text.startsWith("/buy") || text.startsWith("/sell")) {
      //       const [cmd, symbol, amount] = text.split(" ");
      //       if (!utilities.checkSyntax(text)) {
      //         telegram.sendMessage(
      //           chat.id,
      //           ...messages.invalidSyntax(text.startsWith("/buy") ? "buy" : "sell")
      //         );
      //       } else if (!utilities.checkSymbol(symbol)) {
      //         telegram.sendMessage(chat.id, ...messages.missingSymbol);
      //       } else {
      //         services.getCurrencyValue(symbol).then(({ data }) => {
      //           const [{ price_usd }] = data;
      //           if (text.startsWith("/buy")) {
      //             const { balance } = snapshot.val().cash;
      //             if (price_usd * amount <= balance && amount > 0) {
      //               ref.update(
      //                 utilities.getBuyCoinUpdateValue(snapshot.val(), data, amount),
      //                 () => {
      //                   telegram.sendMessage(
      //                     chat.id,
      //                     ...messages.buySuccessMessage(amount, symbol)
      //                   );
      //                 }
      //               );
      //             } else {
      //               telegram.sendMessage(
      //                 chat.id,
      //                 ...messages.buyNotEnoughFunds(
      //                   utilities.moduloDivision(balance, price_usd),
      //                   symbol
      //                 )
      //               );
      //             }
      //           } else {
      //             const { coins } = snapshot.val();
      //             if (+coins[symbol] >= +amount && amount > 0) {
      //               ref.update(
      //                 utilities.getSellCoinUpdateValue(
      //                   snapshot.val(),
      //                   data,
      //                   amount
      //                 ),
      //                 () => {
      //                   telegram.sendMessage(
      //                     chat.id,
      //                     ...messages.sellSuccessMessage(amount, symbol)
      //                   );
      //                 }
      //               );
      //             } else {
      //               telegram.sendMessage(
      //                 chat.id,
      //                 ...messages.sellNotEnoughFunds(coins[symbol], symbol)
      //               );
      //             }
      //           }
      //         });
      //       }
      //     } else if (text.startsWith("/wallet")) {
      //       services.getCurrencyValues().then(({ data }) => {
      //         telegram.sendMessage(
      //           chat.id,
      //           ...messages.walletMessage(
      //             snapshot.val(),
      //             utilities.getTotalWalletValue(snapshot.val(), data)
      //           )
      //         );
      //       });
      //     } else if (text.startsWith("/help")) {
      //       telegram.sendMessage(chat.id, ...messages.helpMessage);
      //     }
      //   } else {
      //     if (text.startsWith("/start")) {
      //       services.setInitialBalance(from);
      //       telegram.sendMessage(chat.id, ...messages.welcomeMessage(user));
      //     } else {
      //       telegram.sendMessage(chat.id, ...messages.missingUser(user));
      //     }
      //   }
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

// const server = http.createServer();
// server.listen(process.env.PORT || 5000);
