import { useEffect, useState } from 'react';
import type { Owner } from '../types';

const API = 'http://localhost:9966/petclinic/api';

export function OwnerList() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async (lastName?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = lastName
        ? `${API}/owners?lastName=${encodeURIComponent(lastName)}`
        : `${API}/owners`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data: Owner[] = await res.json();
      setOwners(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const handleSearch = () => {
    fetchOwners(search);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <div>
      <h1>Owners</h1>
      <div>
        <input
          aria-label="Search by last name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>Telephone</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((o) => (
            <tr key={o.id}>
              <td>{o.firstName} {o.lastName}</td>
              <td>{o.address}</td>
              <td>{o.city}</td>
              <td>{o.telephone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
