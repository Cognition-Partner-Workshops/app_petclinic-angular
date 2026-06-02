import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PetType, Pet } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

interface PetFormProps {
  mode: 'add' | 'edit';
}

export default function PetForm({ mode }: PetFormProps) {
  const { id, ownerId } = useParams<{ id: string; ownerId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [typeId, setTypeId] = useState<number>(1);
  const [petOwnerId, setPetOwnerId] = useState<number>(1);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setError('');
    setSuccessMsg('');
    fetch(`${API_BASE}/pettypes`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: PetType[]) => {
        setPetTypes(data);
        if (mode === 'edit' && id) {
          return fetch(`${API_BASE}/pets/${id}`)
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              return res.json();
            })
            .then((pet: Pet) => {
              setName(pet.name);
              setBirthDate(pet.birthDate);
              setTypeId(pet.type.id);
              setPetOwnerId(pet.ownerId);
              setIsLoading(false);
            })
            .catch((err: Error) => {
              setError(err.message);
              setIsLoading(false);
            });
        }
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [mode, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const selectedType = petTypes.find((t) => t.id === typeId) || { id: typeId, name: '' };

    if (mode === 'add') {
      const owId = ownerId || '1';
      fetch(`${API_BASE}/owners/${owId}/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate, type: selectedType }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(() => {
          setSuccessMsg('Pet created');
          navigate(-1);
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    } else {
      fetch(`${API_BASE}/pets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), name, birthDate, type: selectedType, ownerId: petOwnerId }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          setSuccessMsg('Pet updated');
          navigate(-1);
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{mode === 'add' ? 'Add Pet' : 'Edit Pet'}</h2>
      {error && <div role="alert">{error}</div>}
      {successMsg && <div role="status">{successMsg}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            aria-label="Pet Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pet Name"
          />
        </div>
        <div>
          <input
            aria-label="Birth Date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
        <div>
          <select
            aria-label="Pet Type"
            value={typeId}
            onChange={(e) => setTypeId(Number(e.target.value))}
          >
            {petTypes.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">{mode === 'add' ? 'Create' : 'Update'}</button>
        <button type="button" onClick={() => navigate(-1)}>Back</button>
      </form>
    </div>
  );
}
