const { allowed_coins } = require("./constants");
const { propOr } = require("ramda");

getUserName = ({ first_name, last_name, username }) =>
  first_name ? `${first_name}${last_name ? " " + last_name : ""}` : username;

checkSymbol = symbol => Object.keys(allowed_coins).includes(symbol);

checkSyntax = text => {
  const [cmd, symbol, amt] = text.split(" ");
  return typeof symbol === "string" && !isNaN(amt);
};

moduloDivision = (a, b) => (a - a % b) / b;

getBuyCoinUpdateValue = ({ cash, coins }, data, amount) => {
  const [{ price_usd, symbol }] = data;
  const { balance } = cash;
  return {
    "cash/balance": (+balance - +amount * +price_usd).toFixed(2),
    [`coins/${symbol}`]: (+propOr(0, symbol, coins) + +amount).toFixed(4)
  };
};

getSellCoinUpdateValue = ({ cash, coins }, data, amount) => {
  const [{ price_usd, symbol }] = data;
  const { balance } = cash;
  return {
    "cash/balance": (+balance + +amount * +price_usd).toFixed(2),
    [`coins/${symbol}`]: (+propOr(0, symbol, coins) - +amount).toFixed(4)
  };
};

module.exports = {
  getBuyCoinUpdateValue,
  getSellCoinUpdateValue,
  checkSymbol,
  checkSyntax,
  getUserName,
  moduloDivision
};
