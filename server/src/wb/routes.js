import { getWbSuppliesList } from "./controllers/fbs/getWbSuppliesList.js";
import { getWbFbsList } from "./controllers/fbs/getWbFbsList.js";
import { getWbOrdersList } from "./controllers/fbs/getWbOrdersList.js";
import { updateWbFbsList } from "./controllers/fbs/updateWbFbsList.js";
import { setWbApiKey } from "./controllers/fbs/setWbApiKey.js";
import multer from "multer";

const upload = multer();
export function wbRoutes(app, db) {
  app.get("/api/wb/supplies", async (req, res) => {
    const respo = await getWbSuppliesList(db);
    return res.send(respo);
  }); 

  app.post("/api/wb/supplies/stickers", async (req, res) => {
    const respo = await getWbOrdersList(req.body, db);
    res.attachment('archive.zip');
    res.send(respo);
    //res.sendFile(respo);
  });

  app.get("/api/wb/fbs/editlist", upload.single("file"), async (req, res) => {
    const respo = await getWbFbsList();
    res.sendFile(respo);
  });

  app.post("/api/wb/fbs/editlist", upload.single("file"), async (req, res) => {
    const respo = await updateWbFbsList(req);
    res.send(respo);
  });

  app.post("/config/api-key", async (req, res) => {
    const respo = await setWbApiKey(req, db);
    res.send(respo);
  });
}
