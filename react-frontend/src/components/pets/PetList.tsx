import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Pet } from '../../types';
import { getPets } from '../../api/petService';

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);
    const fetchPets = async () => {
      try {
        const data = await getPets();
        if (!cancelled) setPets(data);
      } catch {
        if (!cancelled) setErrorMessage('Failed to load pets.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchPets();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2>Pets</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => navigate('/pets/add')}>Add Pet</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && pets.length === 0 && <p>No pets found.</p>}
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
            {pets.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.birthDate}</td>
                <td>{p.type?.name}</td>
                <td>
                  {p.owner ? (
                    <Link to={`/owners/${p.owner.id}`}>
                      {p.owner.firstName} {p.owner.lastName}
                    </Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <Link to={`/pets/${p.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
