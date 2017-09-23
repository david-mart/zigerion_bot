const { hasIn, propOr, path } = require("ramda");
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
  this.command = this.command.split("@")[0].substring(1);
}

Zigerion.prototype.sendMessage = function(messageText) {
  return new Promise(resolve => {
    this.telegram.sendMessage(this.chat.id, messageText, messageOptions).then(
      ({ chat, date, message_id }) => {
        console.log(chat);
        console.log(
          `${new Date()}: ${propOr("Direct message", "title", chat)} >>> ${this
            .displayName} >>> ${this.command}`
        );
        resolve(message_id);
      },
      ({ response }) => {
        console.log(
          `${new Date()}: TELEGRAM ERROR >>> ${response.body.description}`
        );
        this.sendMessage(response.body.description);
      }
    );
  });
};

Zigerion.prototype.deleteMessage = function(id) {
  this.telegram.deleteMessage(this.chat.id, id).then(
    () => {},
    ({ response }) => {
      console.log(
        `${new Date()}: TELEGRAM ERROR >>> ${response.body.description}`
      );
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

Zigerion.prototype.start = function () {
  if (this.user) {
    this.sendMessage(messages.welcomeBack(this.displayName));
  }
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

Zigerion.prototype.help = function() {
  this.sendMessage(messages.helpMessage);
};

Zigerion.prototype.wallet = function() {
  services.getCurrencyValues().then(({ data }) => {
    console.log(data);
    this.sendMessage(
      messages.walletMessage(
        this.user,
        utilities.getTotalWalletValue(this.user, data)
      )
    ).then(chat => {
      this.overwriteWallet(chat);
    });
  });
};

Zigerion.prototype.overwriteWallet = function(message_id) {
  this.ref.update(
    {
      [`wallet/${this.chat.id}/id`]: message_id
    },
    () => {
      if (path(["wallet", this.chat.id, "id"], this.user)) {
        setTimeout(() => {
          this.deleteMessage(this.user.wallet[this.chat.id].id);
        }, 1000);
      }
    }
  );
};

module.exports = Zigerion;
