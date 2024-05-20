// Function declaration, to pass to the model.
const ScrapeInformationFromWebForstudyMaterial = {
    name: "ScrapeInformationFromWebForstudyMaterial",
    parameters: {
      type: "OBJECT",
      description: "Get some informations like images, videos or online resources to make study material from web",
      properties: {
        topic: {
          type: "STRING",
          description: "The topic for which it will scrape online resources",
        }
      },
      required: ["topic"],
    },
  };


  const getExchangeRateFunctionDeclaration = {
    name: "getExchangeRate",
    parameters: {
      type: "OBJECT",
      description: "Get the exchange rate for currencies between countries",
      properties: {
        currencyFrom: {
          type: "STRING",
          description: "The currency to convert from.",
        },
        currencyTo: {
          type: "STRING",
          description: "The currency to convert to.",
        },
      },
      required: ["currencyTo", "currencyFrom"],
    },
  };
  
module.exports = {ScrapeInformationFromWebForstudyMaterial, getExchangeRateFunctionDeclaration}