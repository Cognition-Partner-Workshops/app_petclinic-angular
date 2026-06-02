import { useEffect, useState } from 'react';
import type { Vet } from '../types';

const API = 'http://localhost:9966/petclinic/api';

export function VetList() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/vets`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Vet[] = await res.json();
        setVets(data);
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
      <h1>Veterinarians</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialties</th>
          </tr>
        </thead>
        <tbody>
          {vets.map((v) => (
            <tr key={v.id}>
              <td>{v.firstName} {v.lastName}</td>
              <td>{v.specialties.map((s) => s.name).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
