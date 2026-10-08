const express = require('express');
const path = require('path');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Serve static files (index.html, CSS, JS, images) from root directory
app.use(express.static(__dirname));

// Optional: Add your API routes here (e.g., /products, /orders)

// Catch-all route to serve index.html on root '/' request
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Use Render's dynamic port or default to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});