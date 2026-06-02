import { useEffect, useState } from 'react';
import type { Pet } from '../types';

const API = 'http://localhost:9966/petclinic/api';

export function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/pets`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Pet[] = await res.json();
        setPets(data);
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
      <h1>Pets</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Birth Date</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.birthDate}</td>
              <td>{p.type.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
