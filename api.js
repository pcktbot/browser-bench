// import Crawler from './puppeteer.js';

export default function (app) {

  app.use('*', async (req, res, next) => {
    console.log('\x1b[31m', req.path);
    next();
  });

  app.get('/', (req, res) => {
    res.json({message: 'Hello World!'});
  });

  app.post('/wcag', async (req, res) => {
    console.info(req.body);
    res.json({message: `Starting: ${req.body.url}`});
  });

}