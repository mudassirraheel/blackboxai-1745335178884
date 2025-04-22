const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// In-memory store for generated links (for demo purposes)
const links = new Set();

app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to generate a unique tracking link
app.get('/generate-link', (req, res) => {
  const id = uuidv4();
  links.add(id);
  const link = req.protocol + '://' + req.get('host') + '/track/' + id;
  res.json({ link });
});

// Serve the tracking page for valid links
app.get('/track/:id', (req, res) => {
  const id = req.params.id;
  if (links.has(id)) {
    res.sendFile(path.join(__dirname, 'public', 'track.html'));
  } else {
    res.status(404).send('Invalid tracking link');
  }
});

app.listen(port, () => {
  console.log('Server running at http://localhost:' + port);
});
