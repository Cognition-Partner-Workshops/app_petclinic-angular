import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Owner } from '../../types';
import { getOwner, deleteOwner } from '../../api/ownerService';

export default function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!id || isNaN(Number(id))) {
      setErrorMessage('Invalid owner ID.');
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getOwner(Number(id));
        if (!cancelled) setOwner(data);
      } catch {
        if (!cancelled) setErrorMessage('Failed to load owner.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = () => {
    if (!owner) return;
    setErrorMessage(null);
    deleteOwner(owner.id)
      .then(() => {
        setSuccessMessage('Owner deleted.');
        setTimeout(() => navigate('/owners'), 1000);
      })
      .catch(() => {
        setErrorMessage('Failed to delete owner.');
      });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Owner Details</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      {successMessage && (
        <div role="status" style={{ color: 'green', marginBottom: 8 }}>
          {successMessage}
          <button onClick={() => setSuccessMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      {!owner && !errorMessage && <p>Owner not found.</p>}
      {owner && (
        <>
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
          <div style={{ marginTop: 16 }}>
            <button onClick={() => navigate(`/owners/${owner.id}/edit`)}>Edit Owner</button>{' '}
            <button onClick={handleDelete}>Delete Owner</button>{' '}
            <button onClick={() => navigate(`/owners/${owner.id}/pets/add`)}>Add Pet</button>{' '}
            <button onClick={() => navigate(-1)}>Back</button>
          </div>
          <h3>Pets and Visits</h3>
          {owner.pets && owner.pets.length > 0 ? (
            owner.pets.map((pet) => (
              <div key={pet.id} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: '2px solid #ccc' }}>
                <p>
                  <strong>{pet.name}</strong> ({pet.type?.name}) — Born: {pet.birthDate}
                </p>
                <Link to={`/pets/${pet.id}/edit`}>Edit Pet</Link>
                {pet.visits && pet.visits.length > 0 && (
                  <table style={{ marginTop: 8 }}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pet.visits.map((v) => (
                        <tr key={v.id}>
                          <td>{v.date}</td>
                          <td>{v.description}</td>
                          <td>
                            <Link to={`/visits/${v.id}/edit`}>Edit</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <Link to={`/pets/${pet.id}/visits/add`}>Add Visit</Link>
              </div>
            ))
          ) : (
            <p>No pets registered.</p>
          )}
        </>
      )}
    </div>
  );
}
