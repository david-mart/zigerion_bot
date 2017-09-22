const { hasIn, propOr } = require("ramda");
const services = require("./services");
const messages = require("./messages");
const utilities = require("./utilities");

const messageOptions = {
  parse_mode: "Markdown"
};

function Zigerion({ text, from, chat }, snapshot, telegram, testServices) {
  this.text = text;
  this.chat = chat;
  this.from = from;
  this.user = snapshot.val();
  this.displayName = utilities.getUserName(from);
  this.telegram = telegram;
  this.ref = snapshot.ref;
  this.services = testServices ? testServices : services;
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
    this.services.setInitialBalance(this.from);
    message = messages.welcomeMessage(this.displayName);
  } else {
    message = messages.missingUser(this.displayName);
  }
  this.sendMessage(message);
};

Zigerion.prototype.processMessage = function() {
  if (hasIn(this.command, this) && this.command !== "processMessage") {
    this[this.command]();
  }
};

Zigerion.prototype.stock = function() {
  this.services.getCurrencyValues().then(({ data }) => {
    const message = messages.stockMessage(data);
    this.sendMessage(message);
  });
};

Zigerion.prototype.checkTransaction = function() {
  this.coin = this.args[0];
  this.amount = +this.args[1];
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
  return new Promise((resolve, reject) => {
    this.services.getCurrencyValue(this.coin).then(({ data }) => {
      this.price_usd = data[0].price_usd;
      const { balance } = this.user.cash;
      if (this.price_usd * this.amount > balance) {
        reject(utilities.moduloDivision(balance, this.price_usd));
      } else {
        resolve(data);
      }
    });
  });
};

Zigerion.prototype.verifySale = function() {
  return new Promise((resolve, reject) => {
    this.services.getCurrencyValue(this.coin).then(({ data }) => {
      this.price_usd = data[0].price_usd;
      const { balance } = this.user.cash;
      const coinsOwned = propOr(0, this.coin, this.user.coins);
      if (coinsOwned >= this.amount) {
        resolve(data);
      } else {
        reject(coinsOwned);
      }
    });
  });
};

Zigerion.prototype.buy = function() {
  if (this.checkTransaction()) {
    this.verifyPurchase().then(
      () => {
        this.purchaseSuccess();
      },
      avalableAmount => {
        this.sendMessage(messages.buyNotEnoughFunds(avalableAmount, this.coin));
      }
    );
  }
};

Zigerion.prototype.sell = function() {
  if (this.checkTransaction()) {
    this.verifySale().then(
      () => {
        this.purchaseSuccess();
      },
      coinsOwned => {
        this.sendMessage(messages.sellNotEnoughFunds(coinsOwned, this.coin));
      }
    );
  }
};

Zigerion.prototype.purchaseSuccess = function() {
  const modifiedAmount =
    this.command === "buy" ? this.amount : this.amount * -1;
  const newBalance = this.user.cash.balance - modifiedAmount * this.price_usd;
  const newCoin = +propOr(0, this.coin, this.user.coins) + +modifiedAmount;
  this.ref.update(
    {
      "cash/balance": newBalance.toFixed(2),
      [`coins/${this.coin}`]: newCoin.toFixed(4)
    },
    this.sendMessage(
      messages.transactionSuccessMessage[this.command](this.amount, this.coin)
    )
  );
};

module.exports = Zigerion;
