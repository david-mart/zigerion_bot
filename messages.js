const MARKDOWN = { parse_mode: "Markdown" };
const { keys } = require("ramda");

module.exports = {
  welcomeMessage: user => [
    `Welcome, *${user}*! \nSince this is your first time, I'm giving you *100000 USD* to spend on some cryptocurrency. \nMake it last! 🤑 \n\nUse \`/help\` for available commands`,
    MARKDOWN
  ],
  helpMessage: [
    `⌨️ Available bot commands: \n\`/stock\` - view current cryptocurrency marker values \n\`/wallet\` - view your current balance \n\`/buy\` - purchase coins\n\`/sell\` - evaluate coins`,
    MARKDOWN
  ],
  stockMessage: data => [
    data
      .map(
        ({ name, symbol, price_usd }) =>
          `_${name}_ (${symbol}): *${price_usd} USD*`
      )
      .join("\n"),
    MARKDOWN
  ],
  missingUser: user => [
    `Hello, *${user}*! \nLooks like you're trying to play around with some cryptocurrency, but you haven't registered yet. \nPlease register by using \`/start\` `,
    MARKDOWN
  ],
  missingSymbol: [
    `🚫 Uknown coin! \nUse \`/stock\` to see the list of available currencies`,
    MARKDOWN
  ],
  invalidSyntax: value => [
    `🚫 Invalid syntax! \n Example usage: \`/${value} BTC 10\``,
    MARKDOWN
  ],
  buyNotEnoughFunds: (amount, symbol) => [
    `You have expensive taste, buddy, but you don't have enough funds for this 🤧\nYou can afford only *${amount} ${symbol}*.`,
    MARKDOWN
  ],
  sellNotEnoughFunds: (amount, symbol) => [
    `Unfortunately, you don't have enouth coins to sell. You only have *${amount
      ? amount
      : 0} ${symbol}*.`,
    MARKDOWN
  ],
  errorMessage: error => [
    `⚠️ Woops! \nServer has encountered an error: _${error}_`,
    MARKDOWN
  ],
  buySuccessMessage: (amount, symbol) => [
    `🎉 Congratulations! \nYou have purchased *${amount} ${symbol}*`,
    MARKDOWN
  ],
  buySuccessMessage: (amount, symbol) => [
    `🎊 Very well done! \nYou have sold *${amount} ${symbol}*`,
    MARKDOWN
  ],
  walletMessage: ({ cash, coins }) => [
    `🏦 Your current balance \n\n💵 Cash: \n*${cash.currency} ${cash.balance}* \n\n💰 Coins:${keys(
      coins
    )
      .map(key => `\n*${key} ${coins[key]}*`)
      .join("")}`,
    MARKDOWN
  ]
};
