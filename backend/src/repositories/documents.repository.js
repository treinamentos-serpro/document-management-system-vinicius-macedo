const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Diretório local onde os arquivos enviados são persistidos (multer diskStorage).
const STORAGE_DIR = path.join(__dirname, '..', '..', 'storage');

// Limite de tamanho de upload configurável via variável de ambiente (12-Factor).
const MAX_UPLOAD_SIZE_BYTES = Number(process.env.MAX_UPLOAD_SIZE_BYTES) || 20 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
    cb(null, STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const uploadMiddleware = multer({ storage, limits: { fileSize: MAX_UPLOAD_SIZE_BYTES } });

// Metadados dos documentos mantidos em memória nesta fase do projeto.
const documents = [];

function create(document) {
  documents.push(document);
  return document;
}

function findAll() {
  return [...documents];
}

function findById(id) {
  return documents.find((document) => document.id === id);
}

function resolveFilePath(document) {
  return path.join(STORAGE_DIR, document.storedName);
}

module.exports = { uploadMiddleware, create, findAll, findById, resolveFilePath };
