import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Owner } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

export default function OwnerList() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lastName = searchParams.get('lastName') || '';

  useEffect(() => {
    setError('');
    setIsLoading(true);
    const url = lastName
      ? `${API_BASE}/owners?lastName=${encodeURIComponent(lastName)}`
      : `${API_BASE}/owners`;
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Owner[]) => {
        setOwners(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [lastName]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <div>
      <h2>Owners</h2>
      <button onClick={() => navigate('/owners/add')}>Add Owner</button>
      {!isLoading && owners.length === 0 && <p>No owners found</p>}
      <ul>
        {owners.map((owner) => (
          <li key={owner.id}>
            <a href={`/owners/${owner.id}`}>
              {owner.firstName} {owner.lastName}
            </a>
            {' - '}{owner.city} - {owner.telephone}
          </li>
        ))}
      </ul>
    </div>
  );
}
