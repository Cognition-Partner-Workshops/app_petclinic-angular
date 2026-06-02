import { useEffect, useState } from 'react';
import type { Visit } from '../types';

const API = 'http://localhost:9966/petclinic/api';

interface VisitFormProps {
  visit?: Visit;
  ownerId?: number;
  petId?: number;
}

export function VisitForm({ visit, ownerId, petId }: VisitFormProps) {
  const [date, setDate] = useState(visit?.date ?? '');
  const [description, setDescription] = useState(visit?.description ?? '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [detail, setDetail] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVisit = async (visitId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/visits/${visitId}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Visit = await res.json();
      setDetail(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visit?.id) fetchVisit(visit.id);
  }, [visit?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const body = { date, description };

    try {
      let res: Response;
      if (visit) {
        res = await fetch(`${API}/visits/${visit.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        const oId = ownerId ?? 1;
        const pId = petId ?? 1;
        res = await fetch(`${API}/owners/${oId}/pets/${pId}/visits`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setSuccess(visit ? 'Visit updated' : 'Visit created');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const handleDelete = async () => {
    if (!visit) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API}/visits/${visit.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setSuccess('Visit deleted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>{visit ? 'Edit Visit' : 'New Visit'}</h1>
      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}
      {detail && <p data-testid="visit-detail">{detail.description}</p>}
      <label>
        Date
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Description
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button type="submit">{visit ? 'Update' : 'Create'}</button>
      {visit && (
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      )}
    </form>
  );
}
