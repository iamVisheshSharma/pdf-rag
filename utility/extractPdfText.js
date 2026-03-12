const { PDFParse } = require('pdf-parse');
const fs = require('fs')
const path = require('path')

async function extractText(path) {
    const buffer = await fs.readFileSync(path)
    const parse = new PDFParse({data: buffer})
    const data = await parse.getText()
    await parse.destroy()
    return data.text;
}

async function chunkText(text, size = 500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += size){
        chunks.push(text.slice(1,i+size))
    }
    return chunks;
}

async function getPathName() {
    let filePath = path.join(__dirname, 'files/ovw-short.pdf')
    return filePath;
}

module.exports = {
    extractText,
    chunkText,
    getPathName,
}