// FRONT/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve todos os arquivos da pasta atual (FRONT)
app.use(express.static(__dirname));

// Quando acessar /contacorrente, envia o index.html
app.get('/contacorrente', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});



app.listen(PORT,"0.0.0.0", () => {
  console.log(`✅ Frontend rodando em http://192.168.1.115:${PORT}/contacorrente`);
});
