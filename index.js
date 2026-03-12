const express = require('express')
const multer = require("multer");
const fs = require("fs");
const { extractText, chunkText } = require('./utility/extractPdfText');
const { openDB, addData } = require('./database');
const { answerQuery } = require('./query');
const { default: axios, options } = require("axios");
const cors = require("cors");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const app = express()
app.use(cors());
app.use(express.json());        // 🔥 This fixes req.body for JSON
app.use(express.urlencoded({ extended: true }));
port = 3000

app.get('/', async (req, res) => {
    return res.json({message: 'Hello Men', status: 200})
})

app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const fileData = await extractText(filePath);
    const dataChunks = await chunkText(fileData);
    let len = dataChunks?.length;
    const coll = await openDB();
    for (const chunk of dataChunks) {
      console.log(`Chunks ${len} is loading...`);
      const response = await axios.post("http://localhost:11434/api/embed", {
        model: "embeddinggemma",
        input: chunk,
        options: {
          num_ctx: 2048,
        },
      });
      await addData({
        collection: coll,
        chunk: chunk,
        embedembeddingsArray: response.data.embeddings,
      });
      len = len - 1;
    }

    res.json({ message: "PDF processed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing PDF" });
  }
});

app.post('/ask', async (req, res) => {
    try {
        const {question} = req.body
        const answer = await answerQuery(question)
        console.log('LOG:', answer)
        return res.json({ answer });
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ error: "Error" });
    }
})

app.listen(port, () => {
    console.log(`SERVER@http://localhost:${port}`)
})