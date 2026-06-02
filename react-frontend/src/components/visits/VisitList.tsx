import { useState, useEffect } from 'react';
import { getVisits } from '../../services/api';
import type { Visit } from '../../types';

export default function VisitList() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    getVisits()
      .then((data) => {
        setVisits(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load visits.');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Visits</h1>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      {!isLoading && visits.length === 0 && <p>No visits found</p>}
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Pet</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.id}>
              <td>{visit.date}</td>
              <td>{visit.description}</td>
              <td>{visit.pet?.name ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
