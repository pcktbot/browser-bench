import { config } from 'dotenv';
config();
import express from 'express';
const app = express();
const port = process.env.PORT || 8081;

app.use(express.json());
import api from './api.js';
api(app);

app.listen(port, () => console.log(`Yo! I'm listening on port ${port}!`));
