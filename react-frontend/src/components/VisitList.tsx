import { useEffect, useState } from 'react';
import type { Visit } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

export default function VisitList() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    fetch(`${API_BASE}/visits`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Visit[]) => {
        setVisits(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <div>
      <h2>Visits</h2>
      {!isLoading && visits.length === 0 && <p>No visits found</p>}
      <ul>
        {visits.map((visit) => (
          <li key={visit.id}>
            {visit.date}: {visit.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
