const express = require('express');
const app = express();
const port = process.env.PORT || 5500;
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server, {
  maxHttpBufferSize: 1e8,// Increase this value as needed (e.g., 100MB)
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
const { Socket } = require('dgram');
const { text } = require('stream/consumers');
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
    //console.log(data)
    var model;
    if (data.prompt_type === 'text') {
      //console.log(data)
      //gemini-pro
      model = genAI.getGenerativeModel({
        model: "gemini-pro"
      })

      if (data.feature === 'material') {
        // console.log("Material...")
        //Scrape Data from web
        socket.emit('material-status', "Searching for " + data.topic + "...")
        const ScrappedData = await ScrapeData(data.topic)
        var images;

        //console.log(ScrappedData[0].textContent)
        // //Send it to Gemini to Format better
        //console.log(`${ScrappedData[0].textContent}`)
        //console.log("Generating content...")
        socket.emit('material-status', "Generating Content...")

        const result = await model.generateContent(`${ScrappedData[0].textContent}, these are the data that i have got from internet \n${data.prompt}`)
        //console.log(`${ScrapeData.textContent}\n${data.prompt}`)
        socket.emit('material-status', "Almost there ...")

        const response = await result.response;
        const textOutput = response.text();
        //console.log(textOutput)
        socket.emit('processed-prompt-material', textOutput)
        socket.emit('material-status', "")

        // //wallah, you got the output

      }

      else if (data.feature === 'roadmap'){
        console.log("generating roadmap...")
        const promptTemplate = `Please make a roadmap for ${data.topic}. The roadmap should be divided into several phases, each containing main tasks and their respective sub-tasks. Each phase should be clearly labeled, and for each main task, list out the sub-tasks. Provide important considerations or dependencies if applicable. The structure should be as follows:
        Phase 1: [Phase Name]
        Main Task: [Main Task Name]
        Sub-task: [Sub-task description]
        Sub-task: [Sub-task description]
        Main Task: [Main Task Name]
        Sub-task: [Sub-task description]
        Sub-task: [Sub-task description]
        Phase 2: [Phase Name]
        Main Task: [Main Task Name]
        Sub-task: [Sub-task description]
        Sub-task: [Sub-task description]
        Phase 3: [Phase Name]
        Main Task: [Main Task Name]
        Sub-task: [Sub-task description]
        Sub-task: [Sub-task description]
        Continue this structure for as many phases as necessary to cover the topic comprehensively`
        
        //console.log(promptTemplate)

        const result = await model.generateContentStream(promptTemplate);
        let finaText = '';
        for await(const chunk of result.stream){
          const chunkText = chunk.text();
          finaText += chunkText;
          socket.emit('prompt-response-roadmap', {
            text : chunkText
          })
        }

        socket.emit('prompt-response-end-roadmap', finaText);

      }


    }


    else if (data.prompt_type === 'file') {

      try {
        //console.log(data)
        var chat;
        var model;
        var result;
        var history = [];
       // console.log(history)
        if (data.files.length > 0) {
          model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
          const imageParts = data.files.map(file => ({
            inlineData: {
              data: file.data,
              mimeType: file.type,
            },
          }));
          chat = model.startChat(history, {
            generationConfig: {
              maxOutputTokens: 2000,
            },
          });
          result = await chat.sendMessageStream([data.prompt, ...imageParts]);
          console.log("Imgae file found")
        }

        else {
          model = genAI.getGenerativeModel({ model: 'gemini-pro' });
          chat = model.startChat(history, {
            generationConfig: {
              maxOutputTokens: 2000,
            },
          });
          result = await chat.sendMessageStream(data.prompt);
          console.log("No images found")
        }

        var outputText = "";
        for await (const chunk of result.stream) {
          const chunkText = await chunk.text();
          outputText += chunkText;
          socket.emit('prompt-response-doubt', {
            text: chunkText
          })
        }
        //console.log(outputText)
        history.push({
          role: 'user',
          parts: [{ text: data.prompt }]
        },
          {
            role: 'model',
            parts: [{ text: outputText }]
          })
        socket.emit('response-doubt-end');

        console.log(outputText)

      } catch (error) {
        console.error(error);
        socket.emit('response', 'An error occurred');
      }
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
