const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Route to handle GET requests
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to handle POST requests
app.post('/api/data', (req, res) => {
  const data = req.body;
  // Process the data...
  res.send('Data received: ' + JSON.stringify(data));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
