const { test, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

let server;
let baseUrl;

before(() => {
  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(() => {
  server.close();
});

test('POST /upload sem arquivo retorna 400', async () => {
  const response = await fetch(`${baseUrl}/upload`, { method: 'POST' });
  assert.strictEqual(response.status, 400);
});

test('fluxo completo de upload, listagem e download', async () => {
  const formData = new FormData();
  formData.append('file', new Blob(['conteúdo de teste']), 'arquivo.txt');
  formData.append('owner', 'usuario-teste');

  const uploadResponse = await fetch(`${baseUrl}/upload`, { method: 'POST', body: formData });
  assert.strictEqual(uploadResponse.status, 201);

  const uploaded = await uploadResponse.json();
  assert.strictEqual(uploaded.originalName, 'arquivo.txt');
  assert.strictEqual(uploaded.owner, 'usuario-teste');
  assert.ok(uploaded.id, 'o documento criado deve ter um id');
  assert.strictEqual(uploaded.storedName, undefined, 'o storedName não deve ser exposto na API');

  const listResponse = await fetch(`${baseUrl}/documents`);
  const documents = await listResponse.json();
  assert.ok(documents.some((document) => document.id === uploaded.id));

  const downloadResponse = await fetch(`${baseUrl}/documents/${uploaded.id}/download`);
  assert.strictEqual(downloadResponse.status, 200);
  assert.strictEqual(await downloadResponse.text(), 'conteúdo de teste');
});

test('GET /documents/:id/download com id inexistente retorna 404', async () => {
  const response = await fetch(`${baseUrl}/documents/id-inexistente/download`);
  assert.strictEqual(response.status, 404);
});
