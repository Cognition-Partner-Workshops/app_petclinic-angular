import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getOwnerById, deleteOwner } from '../../services/api';
import type { Owner } from '../../types';

export default function OwnerDetail() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerId) return;
    setError(null);
    getOwnerById(Number(ownerId))
      .then((data) => {
        setOwner(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Owner not found.');
        setIsLoading(false);
      });
  }, [ownerId]);

  const handleDelete = () => {
    if (!ownerId) return;
    deleteOwner(Number(ownerId))
      .then(() => {
        navigate('/owners');
      })
      .catch(() => {
        setError('Failed to delete owner.');
      });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={() => setError(null)}>Dismiss</button>
      </div>
    );
  }

  if (!owner) {
    return null;
  }

  return (
    <div>
      <h1>{owner.firstName} {owner.lastName}</h1>
      <p>{owner.address}</p>
      <p>{owner.city}</p>
      <p>{owner.telephone}</p>

      <Link to={`/owners/${owner.id}/edit`}>Edit Owner</Link>
      <button onClick={handleDelete}>Delete</button>

      <h2>Pets</h2>
      {owner.pets.length === 0 ? (
        <p>No pets registered</p>
      ) : (
        <ul>
          {owner.pets.map((pet) => (
            <li key={pet.id}>
              <Link to={`/pets/${pet.id}/edit`}>{pet.name}</Link>
              {' — '}{pet.type?.name} (born {pet.birthDate})
            </li>
          ))}
        </ul>
      )}
      <Link to={`/owners/${owner.id}/pets/new`}>Add Pet</Link>
    </div>
  );
}
