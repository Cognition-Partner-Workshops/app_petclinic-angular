import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Pet } from '../types';

const API = 'http://localhost:9966/petclinic/api';

interface PetFormProps {
  pet?: Pet;
}

export function PetForm({ pet }: PetFormProps) {
  const { ownerId } = useParams<{ ownerId: string }>();
  const [name, setName] = useState(pet?.name ?? '');
  const [birthDate, setBirthDate] = useState(pet?.birthDate ?? '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [detail, setDetail] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPet = async (petId: number) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/pets/${petId}`);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Pet = await res.json();
      setDetail(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pet?.id) fetchPet(pet.id);
  }, [pet?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const body = { name, birthDate, type: { id: 1, name: 'cat' } };

    try {
      let res: Response;
      if (pet) {
        res = await fetch(`${API}/pets/${pet.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        const oId = ownerId ?? '1';
        res = await fetch(`${API}/owners/${oId}/pets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setSuccess(pet ? 'Pet updated' : 'Pet created');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const handleDelete = async () => {
    if (!pet) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API}/pets/${pet.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setSuccess('Pet deleted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>{pet ? 'Edit Pet' : 'New Pet'}</h1>
      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}
      {detail && <p data-testid="pet-detail">{detail.name}</p>}
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Birth Date
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </label>
      <button type="submit">{pet ? 'Update' : 'Create'}</button>
      {pet && (
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      )}
    </form>
  );
}
