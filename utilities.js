const { allowed_coins } = require("./constants");

getUserName = ({ first_name, last_name, username }) =>
  first_name ? `${first_name}${last_name ? " " + last_name : ""}` : username;

checkSymbol = symbol => Object.keys(allowed_coins).includes(symbol);

checkSyntax = text => {
  const [cmd, symbol, amt] = text.split(" ");
  return typeof symbol === "string" && !isNaN(amt);
};

moduloDivision = (a, b) => (a - a % b) / b;

getTotalWalletValue = ({ cash, coins }, data) => {
  let total = +cash.balance;
  if (coins) {
    data.forEach(({ symbol, price_usd }) => {
      total += coins[symbol] ? +coins[symbol] * +price_usd : 0;
    });
  }
  return total.toFixed(2);
};

module.exports = {
  getTotalWalletValue,
  checkSymbol,
  checkSyntax,
  getUserName,
  moduloDivision
};
