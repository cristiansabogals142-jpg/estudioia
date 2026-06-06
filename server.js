const { GoogleGenerativeAI } = require("@google/genai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
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
app.post("/api/gpt", async (req, res) => {
  const { question } = req.body;

  try {
    const prompt = `
Eres un tutor inteligente.

Usa este documento para responder:

${documentText.slice(0, 8000)}

---

Pregunta del estudiante:
${question}

Responde claro, educativo y resumido.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });

  } catch (err) {
    console.log(err);

    res.json({
      response:
        "No se pudo usar IA en este momento. Pero el sistema está funcionando."
    });
  }
});
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