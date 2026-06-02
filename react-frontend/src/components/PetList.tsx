import { useEffect, useState } from 'react';
import type { Pet } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    fetch(`${API_BASE}/pets`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Pet[]) => {
        setPets(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <div>
      <h2>Pets</h2>
      {!isLoading && pets.length === 0 && <p>No pets found</p>}
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>
            {pet.name} - {pet.type.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
