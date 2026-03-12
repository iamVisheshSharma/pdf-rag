const { default: axios } = require("axios");
const { openDB, fetchData } = require("./database");

async function answerQuery(query) {
  try {
    const collection = await openDB()
    const response = await axios.post("http://localhost:11434/api/embed", {
      model: "embeddinggemma",
      input: query,
      options: {
        num_ctx: 2048,
      },
    });
    
    const result = await fetchData({
        collection: collection,
        embeddings: response.data.embeddings,
    })

    const ctx = result.documents[0].join("\n\n")

    console.log('AI IS WORKING...')
    const finalResponse = await axios.post('http://localhost:11434/api/chat', {
        model: 'gemma:2b',
        messages: [{
            role: 'user',
            content: `
              You are a helpful assistant. Use the following PDF excerpts to answer the question.
              If the answer isn't in the context, say you don't know.

              CONTEXT:
              ${ctx}

              QUESTION:
              ${query}
            `
        }],
        stream: false
    })

    console.log('AI ANSWER READY')

    // const gemma_list = [finalResponse?.data]

    let answer = finalResponse?.data?.message?.content
    return JSON.stringify(answer)
    
  } catch (error) {
    console.log('Error::', error)
  }
}

module.exports = {
    answerQuery
}