const axios = require("axios");
const config = require("./config");
const db = require("./database");

getCurrencyValues = () => axios.get(config.CRYPTO_API_URL);

setInitialBalance = username =>
  db.ref("/users").set({
    [username]: {
      cash: {
        balance: 100000,
        currency: "USD"
      }
    }
  });

module.exports = { getCurrencyValues, setInitialBalance };
