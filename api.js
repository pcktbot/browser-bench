const Crawler = require('./puppeteer');
const creds = require('./creds/cms-staging');

module.exports = function (app) {
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });


  app.post("/test-suite", async (req, res) => {
    const crawler = new Crawler();
    const results = await crawler.run(creds);
    res.send(results);
  });
}