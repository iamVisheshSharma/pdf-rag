const {ChromaClient} = require('chromadb')

async function openDB(params) {
    const client = new ChromaClient()
    const collection = await client.getOrCreateCollection({
        name: "pdf_rag_db",
    })
    return collection
}

async function addData({collection, chunk, embedembeddingsArray}) {
    console.log(embedembeddingsArray?.length)
    await collection.add({
        documents: [chunk],
        embeddings: embedembeddingsArray,
        ids: [crypto.randomUUID()]
    })
}

async function fetchData({collection, embeddings}) {
    const result = await collection.query({
        queryEmbeddings: embeddings,
        nResult: 3
    })
    return result
}

module.exports = {
    openDB,
    addData,
    fetchData
}

