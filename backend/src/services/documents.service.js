const crypto = require('crypto');
const path = require('path');
const documentsRepository = require('../repositories/documents.repository');

function registerUpload({ file, owner }) {
  const document = {
    id: crypto.randomUUID(),
    originalName: file.originalname,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    owner: owner || null,
    storedName: file.filename,
  };

  return documentsRepository.create(document);
}

function listDocuments() {
  return documentsRepository.findAll();
}

function getDownloadInfo(id) {
  const document = documentsRepository.findById(id);

  if (!document) {
    return null;
  }

  return {
    filePath: path.join(documentsRepository.STORAGE_DIR, document.storedName),
    originalName: document.originalName,
  };
}

module.exports = { registerUpload, listDocuments, getDownloadInfo };
