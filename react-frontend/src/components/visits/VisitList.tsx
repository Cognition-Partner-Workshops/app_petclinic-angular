import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPetById } from '../../services/api';
import type { Pet } from '../../types';

export default function VisitList() {
  const { ownerId, petId } = useParams<{ ownerId: string; petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);

    if (!ownerId || !petId) {
      setErrorMessage('Owner ID and Pet ID are required');
      setIsLoading(false);
      return;
    }

    const petIdNum = Number(petId);
    if (Number.isNaN(petIdNum)) {
      setErrorMessage('Invalid pet ID');
      setIsLoading(false);
      return;
    }

    getPetById(petIdNum)
      .then((data) => {
        if (!cancelled) {
          setPet(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load pet';
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
  }, [ownerId, petId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (errorMessage) {
    return (
      <div>
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          {errorMessage}{' '}
          <button type="button" onClick={() => setErrorMessage(null)}>
            Dismiss
          </button>
        </div>
        <button type="button" onClick={() => navigate('/owners')}>
          Back to Owners
        </button>
      </div>
    );
  }

  if (!pet) {
    return <p>Pet not found.</p>;
  }

  return (
    <div>
      <h2>Visits for {pet.name}</h2>

      <Link to={`/owners/${ownerId}/pets/${petId}/visits/add`}>
        Add Visit
      </Link>

      {pet.visits.length === 0 ? (
        <p>No visits recorded.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pet.visits.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.date}</td>
                <td>{visit.description}</td>
                <td>
                  <Link
                    to={`/owners/${ownerId}/pets/${petId}/visits/${visit.id}/edit`}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(`/owners/${ownerId ?? ''}`))}>
          Back
        </button>
      </div>
    </div>
  );
}
