import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPets } from '../../services/api';
import type { Pet } from '../../types';

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);

    getPets()
      .then((data) => {
        if (!cancelled) {
          setPets(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load pets';
          setErrorMessage(message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2>Pets</h2>

      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          {errorMessage}{' '}
          <button type="button" onClick={() => setErrorMessage(null)}>
            Dismiss
          </button>
        </div>
      )}

      {isLoading && <p>Loading...</p>}

      {!isLoading && !errorMessage && pets.length === 0 && (
        <p>No pets found.</p>
      )}

      {!isLoading && pets.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Type</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.birthDate}</td>
                <td>{pet.type?.name}</td>
                <td>
                  {pet.owner ? (
                    <Link to={`/owners/${pet.owner.id}`}>
                      {pet.owner.firstName} {pet.owner.lastName}
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </td>
                <td>
                  <Link to={`/owners/${pet.ownerId}/pets/${pet.id}/edit`}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
