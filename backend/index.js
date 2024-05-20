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

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { MakeGoogleSearch, ScrapeData, scrapeImages } = require('./Services/WebScrapper');
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
      //console.log(data)
      //gemini-pro
      model = genAI.getGenerativeModel({
        model: "gemini-pro",
        tools: {
          functionDeclarations: [getExchangeRateFunctionDeclaration, ScrapeInformationFromWebForstudyMaterial]
        }
      })

      if (data.feature === 'material') {
        // console.log("Material...")
        //Scrape Data from web
        socket.emit('material-status', "Searching for " + data.topic)
        const ScrappedData = await ScrapeData(data.topic)
        var images;

        //console.log(ScrappedData[0].textContent)
        // //Send it to Gemini to Format better
        console.log(`${ScrappedData[0].textContent}`)
        //console.log("Generating content...")
        socket.emit('material-status', "Generating Content...")

        const result = await model.generateContent(`${ScrappedData[0].textContent}, these are the data that i have got from internet \n${data.prompt}`)
        //console.log(`${ScrapeData.textContent}\n${data.prompt}`)
        const response = await result.response;
        const textOutput = response.text();
        //console.log(textOutput)
        socket.emit('processed-prompt-material', textOutput)
        socket.emit('material-status', "")

        // //wallah, you got the output

      }
    }

    else if (data.prompt_type === 'file') {
      //gemini-pro-vision
      model = genAI.getGenerativeModel({
        model: "gemini-vision-pro"
      })

      console.log(data)

      // const result = await model.generateContent([data.prompt, data.files]);
      // const response = await result.response;
      // const text = response.text();
      // console.log(text);
    }






  });


  socket.on('disconnect', () => {
    console.log(`User with socket ID : ${socket.id} disconnected`);
  })
})

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
