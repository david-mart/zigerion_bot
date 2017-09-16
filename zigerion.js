const { hasIn } = require("ramda");
const services = require("./services");
const messages = require("./messages");
const utilities = require("./utilities");

const messageOptions = {
  parse_mode: "Markdown"
};

function Zigerion({ text, from, chat }, snapshot, telegram) {
  this.text = text;
  this.chat = chat;
  this.from = from;
  this.user = snapshot.val();
  this.dispayName = utilities.getUserName(from);
  this.telegram = telegram;
  this.ref = snapshot.ref();
  [this.command, ...this.args] = this.text.split(" ");
  this.command = this.command.substring(1);
}

Zigerion.prototype.sendMessage = function(messageText) {
  this.telegram.sendMessage(this.chat.id, messageText, messageOptions).then(
    ({ chat, date }) => {
      console.log(
        `${new Date()}: ${chat.id} ${chat.username} >>> ${this.command}`
      );
    },
    ({ response }) => {
      console.log(
        `${new Date()}: TELEGRAM ERROR >>> ${response.body.description}`
      );
      this.sendMessage(response.body.description);
    }
  );
};

Zigerion.prototype.handleMissingUser = function() {
  let message;
  if (this.command === "start") {
    services.setInitialBalance(this.from);
    message = messages.welcomeMessage(this.dispayName);
  } else {
    message = messages.missingUser(this.dispayName);
  }
  this.sendMessage(message);
};

Zigerion.prototype.processMessage = function() {
  if (hasIn(this.command, this) && this.command !== "processMessage") {
    this[this.command]();
  }
};

Zigerion.prototype.stock = function() {
  services.getCurrencyValues().then(({ data }) => {
    const message = messages.stockMessage(data);
    this.sendMessage(message);
  });
};

Zigerion.prototype.checkTransaction = function() {
  this.coin = this.args[0];
  this.amount = this.args[1];
  utilities.checkSyntax(this.text);
  if (!utilities.checkSyntax(this.text)) {
    this.sendMessage(messages.invalidSyntax(this.command));
    return false;
  }
  if (this.amount <= 0) {
    this.sendMessage(messages.sketchyMessage);
    return false;
  }
  return true;
};

Zigerion.prototype.verifyPurchase = function() {
  const verifyAmount = new Promise((resolve, reject) => {
    services.getCurrencyValue(symbol).then(({ data }) => {
      this.price_usd = data[0].price_usd;
      const { balance } = this.user.cash;
      if (this.price_usd * this.amount > balance) {
        reject(utilities.moduloDivision(balance, this.price_usd));
      } else {
        resolve();
      }
    });
  });
};

Zigerion.prototype.buy = function() {
  if (this.checkTransaction()) {
    this.verifyPurchase().then(
      () => {
        console.log("пдыщь");
      },
      avalableAmount => {
        console.log(avalableAmount);
      }
    );
  }
};

module.exports = Zigerion;
