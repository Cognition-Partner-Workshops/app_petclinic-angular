import { useEffect, useState } from 'react';
import type { Vet } from '../types';

const API = 'http://localhost:9966/petclinic/api';

interface VetFormProps {
  vet?: Vet;
}

export function VetForm({ vet }: VetFormProps) {
  const [firstName, setFirstName] = useState(vet?.firstName ?? '');
  const [lastName, setLastName] = useState(vet?.lastName ?? '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [detail, setDetail] = useState<Vet | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVet = async (vetId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/vets/${vetId}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Vet = await res.json();
      setDetail(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (vet?.id) fetchVet(vet.id);
  }, [vet?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const body = { firstName, lastName, specialties: [] };

    try {
      let res: Response;
      if (vet) {
        res = await fetch(`${API}/vets/${vet.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${API}/vets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setSuccess(vet ? 'Vet updated' : 'Vet created');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const handleDelete = async () => {
    if (!vet) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API}/vets/${vet.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setSuccess('Vet deleted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>{vet ? 'Edit Vet' : 'New Vet'}</h1>
      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}
      {detail && <p data-testid="vet-detail">{detail.firstName} {detail.lastName}</p>}
      <label>
        First Name
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <label>
        Last Name
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </label>
      <button type="submit">{vet ? 'Update' : 'Create'}</button>
      {vet && (
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      )}
    </form>
  );
}
