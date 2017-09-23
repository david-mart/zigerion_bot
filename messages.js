const MARKDOWN = { parse_mode: "Markdown" };
const { keys } = require("ramda");
const moment = require("moment");
const { getPriceDifference } = require("./utilities");

module.exports = {
  welcomeMessage: user =>
    `Welcome, *${user}*! \nSince this is your first time, I'm giving you *100000 USD* to spend on some cryptocurrency. \nMake it last! 🤑 \n\nUse /help for available commands`,
  helpMessage: `⌨️ Available bot commands: \n/stock - view current cryptocurrency marker values \n/wallet - view your current balance \n/buy - purchase coins\n/sell - evaluate coins`,
  stockMessage: data =>
    data
      .map(
        ({ name, symbol, price_usd }) =>
          `_${name}_ (${symbol}): *${price_usd} USD*`
      )
      .join("\n"),
  welcomeBack: user => `Welcome back, *${user}*!`,
  missingUser: user =>
    `Hello, *${user}*! \nLooks like you're trying to play around with some cryptocurrency, but you haven't registered yet. \nPlease register by using /start `,
  missingSymbol: `🚫 Uknown coin! \nUse /stock to see the list of available currencies`,
  invalidSyntax: value =>
    `🚫 Invalid syntax! \n Example usage: /${value} BTC 10`,
  buyNotEnoughFunds: (amount, symbol) =>
    `You have expensive taste, buddy, but you don't have enough funds for this 🤧\nYou can afford only *${amount} ${symbol}*.`,
  sellNotEnoughFunds: (amount, symbol) =>
    `Unfortunately, you don't have enouth coins to sell. You only have *${amount
      ? amount
      : 0} ${symbol}*.`,
  errorMessage: error =>
    `⚠️ Woops! \nServer has encountered an error: _${error}_`,
  transactionSuccessMessage: {
    buy: (amount, symbol) =>
      `🎉 Congratulations! \nYou have purchased *${amount} ${symbol}*`,
    sell: (amount, symbol) =>
      `🎊 Very well done! \nYou have sold *${amount} ${symbol}*`
  },
  walletMessage: (
    { cash, coins, username, first_name, last_name, balance },
    total,
    wallet
  ) => {
    let message = `👤 *${first_name ? first_name : ""}* `;
    message += `${last_name ? last_name : ""} `;
    message += `${username ? "(@`" + username + "`)" : ""}\n`;
    message += `🏦 Your current balance \n\n`;
    message += `💵 Cash: \n*${cash.currency} ${cash.balance}* \n\n`;
    message += coins
      ? `💰 Coins: ${keys(coins)
          .map(
            key =>
              `\n*${key} ${coins[key]}* ${wallet
                ? getPriceDifference(
                    balance[key],
                    wallet.stock[key] * coins[key]
                  )
                : ""}`
          )
          .join("")}\n\n`
      : "";
    message += `📝 Total market value of all your assets is *${total} USD* \n\n`;
    message += wallet
      ? `⌚️ Last update: _${moment(wallet.time).fromNow()}_`
      : "";

    return message;
  },
  sketchyMessage:
    "Are you trying to do something sketchy there, friend?\n🤔🤔🤔"
};
