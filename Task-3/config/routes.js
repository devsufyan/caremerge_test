var express = require('express');
var router = express.Router();

const axios = require('axios');
const cheerio = require('cheerio');
const normalizeUrl = require('normalize-url');

router.get('/I/want/title/', (req, res) => {
  if (!req.query.address) {
    return res.send('No Address provided...');
  }
  let titlesRecieved = 0;
  let titlesList = `<ul>`;
  // if only 1 address is provided
  if (typeof req.query.address === "string") {
    let tempArr = [];
    tempArr.push(req.query.address);
    req.query.address = tempArr;
  }
  req.query.address.forEach(address => {

    axios.get(normalizeUrl(address))
      .then(response => {
          const $ = cheerio.load(response.data);
          const webpageTitle = $("title").text();
          titlesList += `<li>${address} - ${webpageTitle}</li>`;
          titlesRecieved++;
          if ( titlesRecieved === req.query.address.length )
              callWhenAllComplete();
      })
      .catch(err => {
          titlesList += `<li>${address} - No Response</li>`;
          titlesRecieved++;
          if ( titlesRecieved === req.query.address.length )
              callWhenAllComplete();
      });
  });

  function callWhenAllComplete (){
    let page = `<html>
    <head></head>
    <body>
    
        <h1> Following are the titles of given websites: </h1>
    
        ${titlesList}</ul>
    </body>
    </html>`
    res.send(page);
  }
});

router.get('*', (req, res) => {
  res.status(404);
  res.send('404 Not Found');
});

router.post('*', (req, res) => {
  res.status(404);
  res.send('404 Not Found');
});

module.exports = router