const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// ADD THIS ↓↓↓
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// existing routes
app.get('/users', async (req, res) => {
  // ...
});

// start server
app.listen(port, () => {
  console.log(`API on ${port}`);
});
