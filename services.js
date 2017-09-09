const axios = require("axios");
const config = require("./config");
const db = require("./database");
const constants = require("./constants");

getCurrencyValues = () =>
  axios.get(config.CRYPTO_API_URL, { params: { limit: 6 } });

setInitialBalance = ({ id, username, first_name, last_name, language_code }) =>
  db.ref("/users").update({
    [id]: {
      id,
      username: username ? username : "",
      first_name: first_name ? first_name : "",
      last_name: last_name ? last_name : "",
      language_code: language_code ? language_code : "",
      cash: {
        balance: 100000,
        currency: "USD"
      }
    }
  });

getCurrencyValue = symbol =>
  axios.get(`${config.CRYPTO_API_URL}${constants.allowed_coins[symbol]}\\`);

module.exports = {
  getCurrencyValue,
  getCurrencyValues,
  setInitialBalance
};
