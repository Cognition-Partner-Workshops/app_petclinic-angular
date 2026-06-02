import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Pet } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

export default function PetDetail() {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    if (!id) {
      setError('Invalid pet ID');
      setIsLoading(false);
      return;
    }
    fetch(`${API_BASE}/pets/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Pet) => {
        setPet(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!pet) return <div>Pet not found</div>;

  return (
    <div>
      <h2>{pet.name}</h2>
      <p>Type: {pet.type.name}</p>
      <p>Birth Date: {pet.birthDate}</p>
      <p>Owner: {pet.owner.firstName} {pet.owner.lastName}</p>
    </div>
  );
}
