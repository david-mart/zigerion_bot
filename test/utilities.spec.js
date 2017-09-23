const { expect } = require("chai");
const { zipCoinsArray, getPriceDifference } = require("../utilities");

describe("Utilities", () => {
  const coinsArray = [
    {
      symbol: "BTC",
      price_usd: "3628.0"
    },
    {
      symbol: "ETH",
      price_usd: "264.532"
    },
    {
      symbol: "BCH",
      price_usd: "415.406"
    },
    {
      symbol: "XRP",
      price_usd: "0.173649"
    },
    {
      symbol: "DASH",
      price_usd: "346.745"
    },
    {
      symbol: "LTC",
      price_usd: "48.2031"
    }
  ];

  const prices = [200, 220];

  it("zipCoisArray() should return correct zipped object", () => {
    const expected = {
      BTC: 3628.0,
      ETH: 264.532,
      BCH: 415.406,
      XRP: 0.173649,
      DASH: 346.745,
      LTC: 48.2031
    };
    const actual = zipCoinsArray(coinsArray);
    expect(actual).to.deep.equal(expected);
  });

  it("getPriceDifference() should return price with difference", () => {
    const expected = "💹 *+10.00%* (+$20)";
    const actual = getPriceDifference(...prices);
    expect(actual).to.equal(expected);
  });
});
