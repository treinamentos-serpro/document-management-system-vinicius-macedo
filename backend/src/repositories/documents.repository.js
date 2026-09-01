const path = require('path');

// Diretório local onde os arquivos enviados são persistidos (multer diskStorage).
const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

// Metadados dos documentos mantidos em memória nesta fase do projeto.
const documents = [];

function create(document) {
  documents.push(document);
  return document;
}

function findAll() {
  return documents;
}

function findById(id) {
  return documents.find((document) => document.id === id);
}

module.exports = { STORAGE_DIR, create, findAll, findById };
