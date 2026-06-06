const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// PDF en memoria
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
app.post("/api/gpt", async (req, res) => {
  const { question } = req.body;

  try {
    const prompt = `
Eres un tutor inteligente.

Usa este documento:

${documentText.slice(0, 8000)}

Pregunta:
${question}

Responde claro y educativo.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });

  } catch (err) {
    console.log(err);

    res.json({
      response: "Error con la IA, pero el servidor funciona."
    });
  }
});

// PORT
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Servidor corriendo en puerto", PORT);
});