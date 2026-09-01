const express = require('express');
const documentsController = require('../controllers/documents.controller');
const { uploadMiddleware } = require('../repositories/documents.repository');

const router = express.Router();

router.post('/upload', uploadMiddleware.single('file'), documentsController.upload);
router.get('/documents', documentsController.list);
router.get('/documents/:id/download', documentsController.download);

module.exports = router;
