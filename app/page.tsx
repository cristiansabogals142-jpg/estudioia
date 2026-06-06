'use client';

import { useState } from 'react';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
const [messages, setMessages] = useState<
  { role: 'user' | 'assistant'; content: string }[]
>([]);
const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  await fetch("http://localhost:3001/api/upload", {
    method: "POST",
    body: formData,
  });

  console.log("PDF subido correctamente");
};

  const handleTool = async (tool: string) => {
  setQuestion(tool);

setMessages((prev) => [
  ...prev,
  {
    role: 'user',
    content: tool,
  },
]);

setLoading(true);

  try {
    const response = await fetch('http://localhost:3001/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: tool,
      }),
    });

    const data = await response.json();

    setMessages((prev) => [
  ...prev,
  {
    role: 'assistant',
    content: data.response,
  },
]);


  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  const handleAsk = async () => {
    if (!question.trim()) return;
    if (loading) return;

    setMessages((prev) => [
  ...prev,
  {
    role: 'user',
    content: question,
  },
]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await response.json();
      setQuestion('');

      setMessages((prev) => [
  ...prev,
  {
    role: 'assistant',
    content: data.response,
  },
]);

    } catch (error) {
      console.error(error);
      alert('Error al conectar con la IA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-[#0f1115] text-white flex">

      {/* Sidebar izquierda */}
      <aside className="w-72 bg-[#171a21] border-r border-[#2a2f3a] flex flex-col">

        <div className="p-5 border-b border-[#2a2f3a]">
          <h1 className="text-xl font-bold">
            EstudioIA
          </h1>
          <p className="text-sm text-gray-400">
            Aprende sobre la amilasa ʕ•́ᴥ•̀ʔっ♡
          </p>
        </div>

        <div className="p-4">
          <button
  onClick={() => document.getElementById("pdfUpload")?.click()}
  className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-medium"
>
  + Subir Documento
</button>
        </div>

        <div className="px-4 flex-1 overflow-y-auto">

          <h2 className="text-xs uppercase tracking-wider text-gray-500 mb-3">
            Documentos
          </h2>

          <div className="space-y-2">

            <div className="bg-[#222734] hover:bg-[#2b3242] p-3 rounded-xl cursor-pointer">
              📄 Anatomía.pdf
            </div>

            <div className="bg-[#222734] hover:bg-[#2b3242] p-3 rounded-xl cursor-pointer">
              📄 Fisiología.pdf
            </div>

            <div className="bg-[#222734] hover:bg-[#2b3242] p-3 rounded-xl cursor-pointer">
              📄 Histología.pdf
            </div>

          </div>

        </div>

      </aside>

      {/* Centro */}
      <section className="flex-1 flex flex-col">

        <div className="bg-[#171a21] border-b border-[#2a2f3a] p-4">
          <h2 className="font-semibold">
            Chat con tus documentos
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {messages.map((msg, index) => (
  <div
    key={index}
    className={
      msg.role === 'user'
        ? 'flex justify-end'
        : ''
    }
  >
    <div
      className={
        msg.role === 'user'
          ? 'bg-blue-600 p-4 rounded-2xl max-w-2xl'
          : 'bg-[#1d2230] p-4 rounded-2xl max-w-2xl whitespace-pre-wrap'
      }
    >
      {msg.content}
    </div>
  </div>
))}

{loading && (
  <div className="flex justify-end">
    <div className="bg-gray-700 p-4 rounded-2xl max-w-2xl">
      Pensando...
    </div>
  </div>
)}

        </div>

        <div className="p-5 border-t border-[#2a2f3a] bg-[#171a21]">

          <div className="flex gap-3">

            <input
  type="text"
  placeholder="Pregunta sobre tus documentos..."
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleAsk();
    }
  }}
  className="flex-1 bg-[#222734] border border-[#313849] rounded-xl px-4 py-3 outline-none focus:border-blue-500"
/>

            <button
              onClick={handleAsk}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl transition disabled:opacity-50"
            >
              {loading ? 'Pensando...' : 'Enviar'}
            </button>

          </div>

        </div>

      </section>

      {/* Panel derecho */}
      <aside className="w-80 bg-[#171a21] border-l border-[#2a2f3a] p-5">
        <input
  type="file"
  accept="application/pdf"
  className="hidden"
  id="pdfUpload"
  onChange={(e) => {
  const file = e.target.files?.[0];
  if (file) {
    uploadFile(file);
    e.target.value = "";
  }
}}
/>
        <h2 className="font-semibold mb-4">
          Herramientas de estudio
        </h2>

        <div className="space-y-3">

          <button
            onClick={() => handleTool(
  'Actúa como un profesor universitario y genera un resumen completo, organizado por títulos y subtítulos.'
)}
            className="w-full bg-[#222734] hover:bg-[#2b3242] p-4 rounded-xl text-left transition"
          >
            📄 Generar Resumen
          </button>

          <button
            onClick={() => handleTool(
  'Genera 20 flashcards con pregunta y respuesta para estudiar medicina.'
)}
            className="w-full bg-[#222734] hover:bg-[#2b3242] p-4 rounded-xl text-left transition"
          >
            🧠 Flashcards
          </button>

          <button
            onClick={() => handleTool(
  'Genera un examen de 10 preguntas de opción múltiple con respuestas al final.'
)}
            className="w-full bg-[#222734] hover:bg-[#2b3242] p-4 rounded-xl text-left transition"
          >
            ❓ Crear Quiz
          </button>

          <button
            onClick={() => handleTool(
  'Genera un caso clínico completo con síntomas, antecedentes, diagnóstico y tratamiento.'
)}
            className="w-full bg-[#222734] hover:bg-[#2b3242] p-4 rounded-xl text-left transition"
          >
            🩺 Caso Clínico
          </button>

          <button
           onClick={() => handleTool(
  'Genera un guion para exposición oral, claro y fácil de presentar.'
)}
            className="w-full bg-[#222734] hover:bg-[#2b3242] p-4 rounded-xl text-left transition"
          >
            🎤 Guion de Exposición
          </button>

          <button
            onClick={() => handleTool(
  'Genera un mapa conceptual en formato jerárquico usando viñetas.'
)}
            className="w-full bg-[#222734] hover:bg-[#2b3242] p-4 rounded-xl text-left transition"
          >
            📊 Mapa Conceptual
          </button>

        </div>

      </aside>

    </main>
  );
}