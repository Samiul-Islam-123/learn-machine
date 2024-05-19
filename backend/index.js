const express = require('express');
const app = express();
const port = process.env.PORT || 5500;
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io');
const io = socketIO(server, {
  cors : {
    origin : "*",
    methods : ["GET", "POST"]
  }
})

const dotenv = require('dotenv');
dotenv.config()

const {v4 : uuid} = require("uuid")

const {GoogleGenerativeAI} = require('@google/generative-ai');
const { dot } = require('node:test/reporters');
const genAI = new GoogleGenerativeAI(`${process.env.GEMINI_API_KEY}`);

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle test 
app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', socket=>{
  console.log("User connected :)");

  //event to handle prompt
  socket.on('process-prompt',async data=>{
    var model;
    if(data.prompt_type === 'text'){
      //gemini-pro
      model = genAI.getGenerativeModel({
        model : "gemini-pro"
      })
    }

    if(data.prompt_type === 'file'){
      //gemini-pro-vision
      model = genAI.getGenerativeModel({
        model : "gemini-vision-pro"
      })
    }

    //generate response
    const response = await model.generateContentStream(data.prompt);
    const ID = uuid();
    //stream the response
    for await(const chunk of response.stream){
      const chunkText = chunk.text();
      console.log(chunkText)
      socket.emit('processed-prompt', {
        text : chunkText,
        ID : ID,
        prompt : data.prompt
      })
    }
    socket.emit('response-end');
  })


  socket.on('disconnect', ()=>{
    console.log(`User with socket ID : ${socket.id} disconnected`);
  })
})

// Start the server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
