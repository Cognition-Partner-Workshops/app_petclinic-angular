import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Visit } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

export default function VisitDetail() {
  const { id } = useParams<{ id: string }>();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    if (!id) {
      setError('Invalid visit ID');
      setIsLoading(false);
      return;
    }
    fetch(`${API_BASE}/visits/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Visit) => {
        setVisit(data);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!visit) return <div>Visit not found</div>;

  return (
    <div>
      <h2>Visit Detail</h2>
      <p>Date: {visit.date}</p>
      <p>Description: {visit.description}</p>
    </div>
  );
}
