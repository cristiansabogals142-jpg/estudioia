const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// 🧠 aquí guardamos el texto del PDF
let documentText = "";

// 📄 SUBIR PDF
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);

    documentText = data.text;

    res.json({
      message: "PDF cargado correctamente",
      length: documentText.length,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error leyendo PDF" });
  }
});

// 🤖 CHAT
app.post("/api/gpt", (req, res) => {
  const { question } = req.body;

  const response = `
Basado en el documento:

${documentText.slice(0, 3000)}

Respuesta a: ${question}
`;

  res.json({
    response,
  });
});

app.listen(3001, () => {
  console.log("Servidor corriendo en puerto 3001");
});