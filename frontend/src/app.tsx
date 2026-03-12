import { useState } from "react";

export function App() {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadPDF = async () => {
    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);

    await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    alert("PDF uploaded & embedding started!");
  };

  const askQuestion = async () => {
    const res = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    console.log('DATA', data);

    setMessages([
      ...messages,
      { type: "user", text: question },
      { type: "bot", text: data.answer },
    ]);

    setQuestion("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6">

        <h1 className="text-2xl font-bold mb-6 text-center">
          📄 PDF RAG Chat
        </h1>

        {/* Upload Section */}
        <div className="mb-6 border p-4 rounded-lg">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={uploadPDF}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Processing..." : "Upload PDF"}
          </button>
        </div>

        {/* Chat Section */}
        <div className="h-80 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 ${
                msg.type === "user"
                  ? "text-right"
                  : "text-left"
              }`}
            >
              <span
                className={`inline-block px-4 py-2 rounded-lg ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Question Input */}
        <div className="flex">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something from the PDF..."
            className="flex-1 border px-4 py-2 rounded-l-lg"
          />
          <button
            onClick={askQuestion}
            className="bg-green-600 text-white px-6 rounded-r-lg"
          >
            Ask
          </button>
        </div>

      </div>
    </div>
  );
}
