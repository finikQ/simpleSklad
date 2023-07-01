import express from "express";
import cors from "cors";
import config from "./src/config.js";
import sqlite3 from "sqlite3";
import { wbRoutes } from "./src/wb/routes.js";
//import fbsRoute from './src/wb/routes/fbs.route.js'

const db = new sqlite3.Database("./my-database.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to sqlite3");
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

    CREATE TABLE IF NOT EXISTS wbitems(
      id INTEGER PRIMARY KEY,
      article TEXT,
      name TEXT,
      barcode INTEGER UNIQUE,
      sortValue INTEGER
    );
  `);
});

const app = express();
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

// Serve static files
app.use(express.static("public"));

// Routes
//app.use('/api', fbsRoute)
wbRoutes(app, db);

// Закрыть подключения к sqlite3
process.on("exit", () => {
  db.close((err) => {
    if (err) {
      console.error("Ошибка закрытия подключения к базе данных:", err.message);
    } else {
      console.log("Подключение к базе данных успешно закрыто");
    }
  });
});

// Start server
app.listen(port, host, () => {
  console.log(`Server >>>>>>>>> http://${host}:${port}`);
});
