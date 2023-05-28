import express from "express";
import cors from "cors";
import multer from "multer";
import config from "./src/config.js";
import sqlite3 from 'sqlite3';

import { getWbSuppliesList } from "./src/controllers/getWbSuppliesList.js";
import { getWbFbsList } from "./src/controllers/getWbFbsList.js";
import { getWbOrdersList } from "./src/controllers/getWbOrdersList.js";
import { updateWbFbsList } from "./src/controllers/updateWbFbsList.js";
import { setWbApiKey } from "./src/controllers/setWbApiKey.js";

const db = new sqlite3.Database('./my-database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to sqlite3');
});

db.serialize(() => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys(
      id INTEGER PRIMARY KEY,
      api_key TEXT
    );

    CREATE TABLE IF NOT EXISTS wbfbssupplies(
      id INTEGER PRIMARY KEY,
      supplies_id TEXT UNIQUE,
      supplies_name TEXT
    );

    CREATE TABLE IF NOT EXISTS wbfbsorders(
      id INTEGER PRIMARY KEY,
      supplies_id TEXT,
      order_id INTEGER UNIQUE,
      item_article TEXT,
      item_barcode INTEGER,
      sticker BLOB,
      sticker_partA INTEGER,
      sticker_partB INTEGER,
      sticker_barcode TEXT
    );
  `)
});

const app = express();
const upload = multer();
const host = config.host;
const port = config.port;

// TODO: Разобраться с Cors
/* let corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5500'],
  methods: ["GET", "POST"],
} */

// Middleware
//app.use(cors(corsOptions))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.get("/api/wb/supplies", async (req, res) => {
  const respo = await getWbSuppliesList(db);
  return res.send(respo);
});

app.post("/api/wb/supplies/stickers", async (req, res) => {
  const respo = await getWbOrdersList(req.body, db);
  res.sendFile(respo);
});

app.get('/api/wb/fbs/editlist', upload.single('file'), async (req, res) => {
  const respo = await getWbFbsList();
  res.sendFile(respo);
});

app.post('/api/wb/fbs/editlist', upload.single('file'), async (req, res) => {
  const respo = await updateWbFbsList(req);
  res.send(respo);
});

app.post('/config/api-key', async (req, res) => {
  const respo = await setWbApiKey(req, db);
  res.send(respo);
});

// Закрыть подключения к sqlite3
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Ошибка закрытия подключения к базе данных:', err.message);
    } else {
      console.log('Подключение к базе данных успешно закрыто');
    }
  });
});

// Start server
app.listen(port, host, () => {
  console.log(`Server >>>>>>>>> http://${host}:${port}`);
});
