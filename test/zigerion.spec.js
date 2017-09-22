const Zigerion = require("../zigerion");
const { expect } = require("chai");
const sinon = require("sinon");

describe("Zigerion message handling class", () => {
  const message = {
    text: "",
    from: {
      first_name: "Rick",
      last_name: "Sanchez"
    },
    chat: {}
  };
  const telegram = {
    sendMessage: () =>
      new Promise(resolve => {
        resolve();
      })
  };
  const snapshot = {
    val: () => ({
      first_name: "Rick",
      last_name: "Sanchez",
      cash: {
        balance: 100000
      },
      coins: {
        BTC: 5
      }
    }),
    ref: {
      update: () => {}
    }
  };
  const services = {
    getCurrencyValue: () =>
      new Promise(resolve => {
        resolve({ data: [{ price_usd: 1000 }] });
      })
  };

  it("should set this.displayName property", () => {
    const expected = "Rick Sanchez";
    const { displayName } = new Zigerion(message, snapshot, telegram);
    expect(displayName).to.equal(expected);
  });

  it("should set this.command", () => {
    const expected = "jeezrick";
    const updatedMessage = message;
    updatedMessage.text = "/jeezrick";
    const { command } = new Zigerion(updatedMessage, snapshot, telegram);
    expect(command).to.equal(expected);
  });

  it("should call the command as class method when this.processMessage() is called ", () => {
    const expected = "jeezrick";
    const updatedMessage = message;
    updatedMessage.text = "/jeezrick";
    const zigerion = new Zigerion(updatedMessage, snapshot, telegram);
    zigerion.jeezrick = new sinon.spy();
    zigerion.processMessage();
    const actual = zigerion.jeezrick.called;
    expect(actual).to.be.true;
  });

  describe("when /buy command is triggered", () => {
    it("should set this.coin to first argument", () => {
      const updatedMessage = message;
      updatedMessage.text = "/buy Shmeckels 25";
      const expected = "Shmeckels";
      const zigerion = new Zigerion(updatedMessage, snapshot, telegram);
      zigerion.processMessage();
      const actual = zigerion.coin;
      expect(actual).to.equal(expected);
    });

    it("should set this.amount to second argument", () => {
      const updatedMessage = message;
      updatedMessage.text = "/buy Shmeckels 25";
      const expected = 25;
      const zigerion = new Zigerion(updatedMessage, snapshot, telegram);
      zigerion.processMessage();
      const actual = zigerion.amount;
      expect(actual).to.equal(expected);
    });

    it("should call this.checkTransaction()", () => {
      const updatedMessage = message;
      updatedMessage.text = "/buy Shmeckels 25";
      const zigerion = new Zigerion(updatedMessage, snapshot, telegram);
      const spy = new sinon.spy(zigerion, "checkTransaction");
      zigerion.processMessage();
      expect(spy.called).to.be.true;
    });

    it("should call this.verifyPurchase() if syntax is correct", () => {
      const updatedMessage = message;
      updatedMessage.text = "/buy Shmeckels 25";
      const zigerion = new Zigerion(updatedMessage, snapshot, telegram);
      const spy = new sinon.spy(zigerion, "verifyPurchase");
      zigerion.processMessage();
      expect(spy.called).to.be.true;
    });

    it("should call this.purchaseSuccess() if transaction amount is correct", () => {
      const updatedMessage = message;
      updatedMessage.text = "/buy Shmeckels 25";
      const zigerion = new Zigerion(updatedMessage, snapshot, telegram);
      const spy = new sinon.spy(zigerion, "purchaseSuccess");
      zigerion.verifyPurchase().then(() => {
        expect(spy.called).to.be.true;
      });
    });

    it("should call this.ref.update() with correct update object when /buy command is triggered", () => {
      const updatedMessage = message;
      updatedMessage.text = "/buy Shmeckels 25";
      const expected = {
        "cash/balance": "99375.00",
        "coins/Shmeckels": "25.0000"
      };
      const zigerion = new Zigerion(updatedMessage, snapshot, telegram);
      zigerion.ref.update = new sinon.spy();
      zigerion.processMessage();
      zigerion.price_usd = 25;
      zigerion.purchaseSuccess();
      const [actual] = zigerion.ref.update.args[0];
      expect(actual).to.deep.equal(expected);
    });
  });

  describe("when /sell command is triggered", () => {
    it("should call this.ref.update() with correct update object when /sell command is triggered", () => {
      const updatedMessage = message;
      updatedMessage.text = "/sell BTC 3";
      const expected = {
        "cash/balance": "103000.00",
        "coins/BTC": "2.0000"
      };
      const zigerion = new Zigerion(updatedMessage, snapshot, telegram);
      zigerion.ref.update = new sinon.spy();
      zigerion.price_usd = 1000;
      zigerion.processMessage();
      zigerion.purchaseSuccess();
      const [actual] = zigerion.ref.update.args[0];
      expect(actual).to.deep.equal(expected);
    });
  });
});
