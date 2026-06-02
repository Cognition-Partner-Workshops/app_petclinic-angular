import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Owner } from '../types';

const API = 'http://localhost:9966/petclinic/api';

export function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/owners/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Owner = await res.json();
        setOwner(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!owner) return null;

  return (
    <div>
      <h1>{owner.firstName} {owner.lastName}</h1>
      <p>{owner.address}</p>
      <p>{owner.city}</p>
      <p>{owner.telephone}</p>
    </div>
  );
}
