import { useEffect, useState } from 'react';
import type { Visit } from '../types';

const API = 'http://localhost:9966/petclinic/api';

export function VisitList() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/visits`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Visit[] = await res.json();
        setVisits(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <div>
      <h1>Visits</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v) => (
            <tr key={v.id}>
              <td>{v.date}</td>
              <td>{v.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
