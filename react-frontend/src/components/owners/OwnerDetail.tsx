import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteOwner, getOwnerById } from '../../services/api';
import type { Owner } from '../../types';

export default function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);

    if (!id) {
      setErrorMessage('Owner ID is required');
      setIsLoading(false);
      return;
    }

    const ownerId = Number(id);
    if (Number.isNaN(ownerId)) {
      setErrorMessage('Invalid owner ID');
      setIsLoading(false);
      return;
    }

    getOwnerById(ownerId)
      .then((data) => {
        if (!cancelled) {
          setOwner(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load owner';
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
  }, [id]);

  function handleDelete() {
    if (!owner) return;
    setIsDeleting(true);
    setErrorMessage(null);

    deleteOwner(owner.id)
      .then(() => {
        navigate('/owners');
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to delete owner';
        setErrorMessage(message);
        setIsDeleting(false);
      });
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (errorMessage && !owner) {
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

  if (!owner) {
    return <p>Owner not found.</p>;
  }

  return (
    <div>
      <h2>Owner Detail</h2>

      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          {errorMessage}{' '}
          <button type="button" onClick={() => setErrorMessage(null)}>
            Dismiss
          </button>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <td>
              {owner.firstName} {owner.lastName}
            </td>
          </tr>
          <tr>
            <th>Address</th>
            <td>{owner.address}</td>
          </tr>
          <tr>
            <th>City</th>
            <td>{owner.city}</td>
          </tr>
          <tr>
            <th>Telephone</th>
            <td>{owner.telephone}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <Link to={`/owners/${owner.id}/edit`}>Edit Owner</Link>{' '}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Owner'}
        </button>
      </div>

      <h3>Pets</h3>
      {owner.pets.length === 0 ? (
        <p>No pets registered.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Type</th>
              <th>Visits</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {owner.pets.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.birthDate}</td>
                <td>{pet.type?.name}</td>
                <td>
                  {pet.visits.length > 0 ? (
                    <ul>
                      {pet.visits.map((visit) => (
                        <li key={visit.id}>
                          {visit.date} — {visit.description}{' '}
                          <Link
                            to={`/owners/${owner.id}/pets/${pet.id}/visits/${visit.id}/edit`}
                          >
                            Edit
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    'No visits'
                  )}
                </td>
                <td>
                  <Link to={`/owners/${owner.id}/pets/${pet.id}/edit`}>
                    Edit Pet
                  </Link>{' '}
                  <Link to={`/owners/${owner.id}/pets/${pet.id}/visits/add`}>
                    Add Visit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1rem' }}>
        <Link to={`/owners/${owner.id}/pets/add`}>Add Pet</Link>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/owners'))}>
          Back
        </button>
      </div>
    </div>
  );
}
