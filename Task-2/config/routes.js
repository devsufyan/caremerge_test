var express = require('express');
var router = express.Router();

const async = require('async');
const cheerio = require('cheerio');
const normalizeUrl = require('normalize-url');
const request = require('request');

router.get('/I/want/title/', (req, res) => {

  if (!req.query.address) {
    return res.send('No Address provided...');
  }
  let titlesRecieved = 0;
  let titlesList = `<ul>`;
  if (typeof req.query.address === "string") {
    let tempArr = [];
    tempArr.push(req.query.address);
    req.query.address = tempArr;
  }

  async.map(req.query.address, fetchTitle, (err, results) => {
    if (err) {
      console.log('Error: ', err);
      callWhenAllComplete();
    } else {
      // console.log('Results: ', results);
      callWhenAllComplete();
    }
  });


  function fetchTitle(address, callback) {
    request(normalizeUrl(address), (err, resp, body)=> {
      if (err) {
          titlesList += `<li>${address} - No Response</li>`;
          titlesRecieved++;
          console.log('Error', err);
          // sending null instead of error
          // because of the error next titles will not be fetched
          callback(null, titlesList);
      } else {
          // console.log('Data: ', resp);
          const $ = cheerio.load(body);
          const webpageTitle = $("title").text();
          titlesList += `<li>${address} - ${webpageTitle}</li>`;
          titlesRecieved++;
          callback(null, titlesList);
      }
    });
  }

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