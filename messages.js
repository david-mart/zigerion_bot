const MARKDOWN = { parse_mode: "Markdown" };

module.exports = {
  welcomeMessage: user => [
    `Welcome, *${user}*! \n Since this is your first time, I'm giving you *100000 USD* to spend on some cryptocurrency`,
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
    `Hello, *${user}*! \n Looks like you're trying to buy some coins, but you aren't registered yet. Please register by using \`/start\` `,
    MARKDOWN
  ]
};
