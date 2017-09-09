const axios = require("axios");
const config = require("./config");

getCurrencyValues = () => {
  axios.get(config.CRYPTO_API_URL).then(data => {
    console.log(data);
  });
};

module.exports = { getCurrencyValues };
