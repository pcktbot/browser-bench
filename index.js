require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.use(express.json());
require('./api')(app);

app.listen(port, () => console.log(`Yo! I'm listening on port ${port}!`));
