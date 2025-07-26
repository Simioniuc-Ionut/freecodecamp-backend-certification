require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
var shortUrlCache = new Map();
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.use(bodyParser.json());

app.use('/api/shorturl', (req, res, next) => {
  
  if (!isValidUrl(req.body.url)) {
    return res.json({ error: 'invalid url' });
  }
  next();
})
 .post('/api/shorturl', (req, res) => {
  let url = req.body.url;
  // Check if URL already exists
  for (let [key, value] of shortUrlCache.entries()) {
    if (value === url) {
      return res.json({ original_url: url, short_url: key });
    }
  }
  let shortUrl = urlCounter++;
  shortUrlCache.set(shortUrl, url);
  res.json({ original_url: url, short_url: shortUrl });
});
app.get('/api/shorturl/:shorturl', (req, res) => {
  const originalUrl = shortUrlCache.get(Number(req.params.shorturl));
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for given input' });
  }
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}