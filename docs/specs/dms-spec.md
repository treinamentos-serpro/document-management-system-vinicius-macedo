# Especificação - Document Management System

> Especificação gerada a partir do modelo em `docs/specs/spec-template.md`.

## 1. Objetivo

Prover um sistema web simples para que usuários enviem, listem e baixem documentos, com armazenamento estritamente local.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos
- Autenticação/autorização real (usuário é apenas um identificador informado)

## 3. Requisitos funcionais

| ID    | Requisito                                                                  |
| ----- | --------------------------------------------------------------------------- |
| RF-01 | O usuário pode enviar um documento via upload (multipart/form-data)         |
| RF-02 | O usuário pode listar os documentos enviados                                |
| RF-03 | O usuário pode baixar um documento pelo identificador                       |
| RF-04 | O sistema retorna erro 400 se nenhum arquivo for enviado no upload          |
| RF-05 | O sistema retorna erro 404 ao tentar baixar um documento com id inexistente |

## 4. Requisitos não funcionais

| ID     | Requisito                                                   |
| ------ | ------------------------------------------------------------ |
| RNF-01 | Arquivos gravados no filesystem local via multer/diskStorage |
| RNF-02 | Metadados mantidos em memória nesta fase                     |
| RNF-03 | Configuração via variáveis de ambiente (12-Factor)            |
| RNF-04 | Metadados são perdidos ao reiniciar o servidor (memória volátil), o que é aceitável nesta fase |

## 5. Modelo de dados (metadados do documento)

| Campo        | Tipo   | Descrição                                          |
| ------------ | ------ | --------------------------------------------------- |
| id           | string | Identificador único do documento, gerado no repository |
| originalName | string | Nome original do arquivo enviado                     |
| size         | number | Tamanho em bytes                                     |
| uploadedAt   | string | Data/hora do upload (ISO 8601)                       |
| owner        | string | Identificador do usuário dono (informado na requisição, sem autenticação real) |

## 6. Contratos de API

Todas as rotas são expostas sob o prefixo `/api` (proxy configurado no Vite do frontend).

### POST /api/upload

- Entrada: arquivo (multipart/form-data, campo `file`) e `owner` (string, opcional/simples)
- Saída de sucesso (201): metadados do documento criado (`id`, `originalName`, `size`, `uploadedAt`, `owner`)
- Erros:
  - 400: nenhum arquivo enviado

### GET /api/documents

- Saída de sucesso (200): lista de metadados de documentos (`id`, `originalName`, `size`, `uploadedAt`, `owner`)

### GET /api/documents/:id/download

- Saída de sucesso (200): conteúdo binário do arquivo, com `Content-Disposition` contendo `originalName`
- Erros:
  - 404: documento com o `id` informado não existe

### Formato de erro padrão

```json
{ "error": "mensagem descritiva em português" }
```

## 7. Decisões arquiteturais

- Backend em Clean Architecture simples: `routes -> controllers -> services -> repositories`, sem que camadas internas conheçam camadas externas.
- Armazenamento de arquivos local via `multer` com `diskStorage`, gravando em `backend/storage`.
- Metadados de documentos mantidos em memória (sem banco de dados nesta fase).
- Frontend baseado em componentes React, comunicando-se com o backend via `fetch` sob o prefixo `/api`.

### Riscos

- Perda de metadados ao reiniciar o servidor, por serem mantidos apenas em memória.
- Ausência de autenticação real: o campo `owner` não impede acesso indevido a documentos de outros usuários.
- Possível concorrência de escrita em disco sob uploads simultâneos, não tratada nesta fase (fora do escopo).

## 8. Plano de execução

Etapas futuras de implementação (roteiro, não executadas neste momento):

1. Implementar o repositório de arquivos e metadados (armazenamento local + estrutura em memória).
2. Implementar a rota e o controller de upload (`POST /upload`), incluindo validação básica de arquivo ausente.
3. Implementar a rota e o controller de listagem (`GET /documents`).
4. Implementar a rota e o controller de download (`GET /documents/:id/download`), incluindo tratamento de id inexistente.
5. Integrar o frontend (páginas/componentes de upload, listagem e download) com os endpoints via `/api`.
