const express = require('express');
const app = express();
const port = process.env.PORT || 5500;
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

const dotenv = require('dotenv');
dotenv.config()

const { v4: uuid } = require("uuid")

const { GoogleGenerativeAI, FunctionDeclarationSchemaType } = require('@google/generative-ai');
const { dot } = require('node:test/reporters');
const { MakeGoogleSearch } = require('./Services/WebScrapper');
const { ScrapeInformationFromWebForstudyMaterial, getExchangeRateFunctionDeclaration } = require('./GeminiFunctions/Functions');
const makeApiRequest = require('./Services/testFunction');
const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle test 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

//functions to pass to the model
const functions = {
  ScrapeInformationFromWebForstudyMaterial: ({ topic }) => {
    return MakeGoogleSearch(topic)
  },
  getExchangeRate: ({ currencyFrom, currencyTo }) => {
    return makeApiRequest(currencyFrom, currencyTo)
  }
}

io.on('connection', socket => {
  console.log("User connected :)");

  //event to handle prompt
  socket.on('process-prompt', async data => {
    var model;
    if (data.prompt_type === 'text') {
      //gemini-pro
      model = genAI.getGenerativeModel({
        model: "gemini-pro",
        tools: {
          functionDeclarations: [getExchangeRateFunctionDeclaration, ScrapeInformationFromWebForstudyMaterial]
        }
      })
    }

    if (data.prompt_type === 'file') {
      //gemini-pro-vision
      model = genAI.getGenerativeModel({
        model: "gemini-vision-pro"
      })
    }

    // const chat = model.startChat({
    //   history: [
    //     {
    //       role: "user",
    //       parts: [{ text: "Hello, you are a virtual tutor who can teach students in a exiting way. Your name i Silver" }],
    //     },
    //     {
    //       role: "model",
    //       parts: [{ text: "Ok sir!" }],
    //     },
    //   ],
    //   generationConfig: {
    //     maxOutputTokens: 2000,
    //   },
    // });



    const chat = model.startChat();
    const prompt = "Can you find some online resources for BJT";

    // Send the message to the model.
    const result = await chat.sendMessageStream(prompt);



    // For simplicity, this uses the first function call found.
    //const call = result.stream.response.functionCalls()[0];

    // if (call) {
    //   // Call the executable function named in the function call
    //   // with the arguments specified in the function call and
    //   // let it call the hypothetical API.
    //   const apiResponse = await functions[call.name](call.args);

    //   // Send the API response back to the model so it can generate
    //   // a text response that can be displayed to the user.
    //   const result2 = await chat.sendMessage([{functionResponse: {
    //     name: 'getExchangeRate',
    //     response: apiResponse
    //   }}]);

    //   // Log the text response.
    //   console.log(result2.response.text());
    // }

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      const call = chunk.functionCalls()[0];
      console.log(call)

      if (call) {
        // Call the executable function named in the function call
        // with the arguments specified in the function call and
        // let it call the hypothetical API.
        const apiResponse = await functions[call.name](call.args);

        // Send the API response back to the model so it can generate
        // a text response that can be displayed to the user.
        const result2 = await chat.sendMessage([{
          functionResponse: {
            name: 'getExchangeRate',
            response: apiResponse
          }
        }]);

        // Log the text response.
        console.log(result2.response.text());
      }
    }



    // //generate response
    // const response = await chat.sendMessageStream(data.prompt);

    // const ID = uuid();
    // //stream the response
    // for await(const chunk of response.stream){
    //   const chunkText = chunk.text();
    //   console.log(chunk.functionCalls)
    //   socket.emit('processed-prompt', {
    //     text : chunkText,
    //     ID : ID,
    //     prompt : data.prompt,
    //     functions : chunk.functionCalls
    //   })
    // }
    // socket.emit('response-end');
  })


  socket.on('disconnect', () => {
    console.log(`User with socket ID : ${socket.id} disconnected`);
  })
})

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
