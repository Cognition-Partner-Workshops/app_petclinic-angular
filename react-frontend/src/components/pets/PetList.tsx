import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPets } from '../../services/api';
import type { Pet } from '../../types';

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    getPets()
      .then((data) => {
        setPets(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load pets.');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Pets</h1>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      {!isLoading && pets.length === 0 && <p>No pets found</p>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Birth Date</th>
            <th>Type</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id}>
              <td>
                <Link to={`/pets/${pet.id}/edit`}>{pet.name}</Link>
              </td>
              <td>{pet.birthDate}</td>
              <td>{pet.type?.name}</td>
              <td>
                {pet.owner
                  ? <Link to={`/owners/${pet.owner.id}`}>{pet.owner.firstName} {pet.owner.lastName}</Link>
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
