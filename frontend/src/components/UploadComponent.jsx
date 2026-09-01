import { useState } from 'react';
import { uploadDocument } from '../services/documentsApi';

export default function UploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setError('Selecione um arquivo para enviar.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const document = await uploadDocument(file, owner);
      onUploadSuccess?.(document);
      setFile(null);
      setOwner('');
      event.target.reset();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enviar documento</h2>
      <div>
        <label htmlFor="file">Arquivo</label>
        <input id="file" type="file" onChange={(event) => setFile(event.target.files[0] ?? null)} />
      </div>
      <div>
        <label htmlFor="owner">Usuário</label>
        <input
          id="owner"
          type="text"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="Identificador do usuário"
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar'}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
