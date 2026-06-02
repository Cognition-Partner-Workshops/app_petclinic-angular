import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Owner } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

export default function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setError('');
    setSuccessMsg('');
    if (!id) {
      setError('Invalid owner ID');
      setIsLoading(false);
      return;
    }
    fetch(`${API_BASE}/owners/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Owner) => {
        setOwner(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  const handleDelete = () => {
    setError('');
    setSuccessMsg('');
    fetch(`${API_BASE}/owners/${id}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setSuccessMsg('Owner deleted');
        navigate('/owners');
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!owner) return <div>Owner not found</div>;

  return (
    <div>
      <h2>{owner.firstName} {owner.lastName}</h2>
      <p>{owner.address}</p>
      <p>{owner.city}</p>
      <p>{owner.telephone}</p>
      {successMsg && <div role="status">{successMsg}</div>}
      <button onClick={() => navigate(`/owners/${id}/edit`)}>Edit Owner</button>
      <button onClick={handleDelete}>Delete Owner</button>
      <h3>Pets</h3>
      {owner.pets.length === 0 ? (
        <p>No pets</p>
      ) : (
        <ul>
          {owner.pets.map((pet) => (
            <li key={pet.id}>
              {pet.name} ({pet.type.name})
              {pet.visits && pet.visits.length > 0 && (
                <ul>
                  {pet.visits.map((visit) => (
                    <li key={visit.id}>
                      {visit.date}: {visit.description}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
