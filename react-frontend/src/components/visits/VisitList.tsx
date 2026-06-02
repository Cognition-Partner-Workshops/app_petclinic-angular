import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Visit } from '../../types';
import { getVisits } from '../../api/visitService';

export default function VisitList() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);
    const fetchVisits = async () => {
      try {
        const data = await getVisits();
        if (!cancelled) setVisits(data);
      } catch {
        if (!cancelled) setErrorMessage('Failed to load visits.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchVisits();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2>Visits</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => navigate('/visits/add')}>Add Visit</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && visits.length === 0 && <p>No visits found.</p>}
      {!isLoading && visits.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Pet</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v) => (
              <tr key={v.id}>
                <td>{v.date}</td>
                <td>{v.description}</td>
                <td>
                  {v.pet ? (
                    <Link to={`/owners/${v.pet.owner?.id}`}>{v.pet.name}</Link>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <Link to={`/visits/${v.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
