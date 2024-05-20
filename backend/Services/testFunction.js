async function makeApiRequest(currencyFrom, currencyTo) {
    // This hypothetical API returns a JSON such as:
    // {"base":"USD","rates":{"SEK": 0.091}}
    console.log("Ai here.........")
    return {
      base: currencyFrom,
      rates: { [currencyTo]: 0.091 },
    };
  }

  module.exports = makeApiRequest