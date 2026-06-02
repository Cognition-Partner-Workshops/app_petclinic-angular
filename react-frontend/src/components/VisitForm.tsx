import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:9966/petclinic/api';

interface VisitFormProps {
  mode: 'add' | 'edit';
}

export default function VisitForm({ mode }: VisitFormProps) {
  const { ownerId, petId, id } = useParams<{
    ownerId: string;
    petId: string;
    id: string;
  }>();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'add') {
      const owId = ownerId || '1';
      const pId = petId || '1';
      fetch(`${API_BASE}/owners/${owId}/pets/${pId}/visits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, description }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(() => {
          setSuccessMsg('Visit created');
          navigate(-1);
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    } else {
      fetch(`${API_BASE}/visits/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), date, description }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          setSuccessMsg('Visit updated');
          navigate(-1);
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    }
  };

  return (
    <div>
      <h2>{mode === 'add' ? 'Add Visit' : 'Edit Visit'}</h2>
      {error && <div role="alert">{error}</div>}
      {successMsg && <div role="status">{successMsg}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            aria-label="Visit Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <input
            aria-label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
        <button type="submit">{mode === 'add' ? 'Create' : 'Update'}</button>
        <button type="button" onClick={() => navigate(-1)}>Back</button>
      </form>
    </div>
  );
}
