const Crawler = require('./puppeteer');

module.exports = function (app) {
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

}