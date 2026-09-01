const documentsService = require('../services/documents.service');

// Remove campos internos (ex.: storedName) antes de expor o documento na API.
function toPublicDocument(document) {
  const { id, originalName, size, uploadedAt, owner } = document;
  return { id, originalName, size, uploadedAt, owner };
}

function upload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
  }

  const document = documentsService.registerUpload({ file: req.file, owner: req.body.owner });
  return res.status(201).json(toPublicDocument(document));
}

function list(req, res) {
  const documents = documentsService.listDocuments().map(toPublicDocument);
  return res.json(documents);
}

function download(req, res) {
  const downloadInfo = documentsService.getDownloadInfo(req.params.id);

  if (!downloadInfo) {
    return res.status(404).json({ error: 'Documento não encontrado.' });
  }

  return res.download(downloadInfo.filePath, downloadInfo.originalName, (err) => {
    if (err && !res.headersSent) {
      res.status(404).json({ error: 'Arquivo não encontrado no armazenamento.' });
    }
  });
}

module.exports = { upload, list, download };
