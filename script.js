const {
  getPathName,
  extractText,
  chunkText,
} = require("./utility/extractPdfText.js");
const { openDB, addData } = require("./database/index.js");
const { default: axios, options } = require("axios");

async function Main() {
  try {
    const coll = await openDB();
    const filePath = await getPathName();
    const fileData = await extractText(filePath);
    const dataChunks = await chunkText(fileData);
    let len = dataChunks?.length;
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
  } catch (error) {
    console.log("Error:", error);
  }
}

Main();
