import express, { Request, Response } from 'express';
import { logInfo } from './utils/logger';
import apiRouter from './api';

const app = express();
const cors = require('cors');
// const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const db = require("./config/db");

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api", apiRouter)

app.get('*', (req: Request, res: Response) => {
  res.send('UNT - Trading Platform!');
});

db()
const port = process.env.PORT || 3000;
app.listen(port, () => {
  logInfo(`Server is running on http://localhost:${port}`);
});
