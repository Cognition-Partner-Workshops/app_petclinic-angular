import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Owner } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

interface OwnerFormProps {
  mode: 'add' | 'edit';
}

export default function OwnerForm({ mode }: OwnerFormProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [isLoading, setIsLoading] = useState(mode === 'edit');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setError('');
    setSuccessMsg('');
    if (mode === 'edit' && id) {
      fetch(`${API_BASE}/owners/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data: Owner) => {
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setAddress(data.address);
          setCity(data.city);
          setTelephone(data.telephone);
          setIsLoading(false);
        })
        .catch((err: Error) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [mode, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const body = { firstName, lastName, address, city, telephone };

    if (mode === 'add') {
      fetch(`${API_BASE}/owners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
        .then((res) => {
          if (res.status === 400) {
            return res.json().then((data) => {
              throw new Error(data.errors?.[0]?.errorMessage || 'Validation error');
            });
          }
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(() => {
          setSuccessMsg('Owner created');
          navigate('/owners');
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    } else {
      fetch(`${API_BASE}/owners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), ...body }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          setSuccessMsg('Owner updated');
          navigate(`/owners/${id}`);
        })
        .catch((err: Error) => {
          setError(err.message);
        });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h2>{mode === 'add' ? 'Add Owner' : 'Edit Owner'}</h2>
      {error && <div role="alert">{error}</div>}
      {successMsg && <div role="status">{successMsg}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            aria-label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
        </div>
        <div>
          <input
            aria-label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>
        <div>
          <input
            aria-label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
        </div>
        <div>
          <input
            aria-label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
          />
        </div>
        <div>
          <input
            aria-label="Telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="Telephone"
          />
        </div>
        <button type="submit">{mode === 'add' ? 'Create' : 'Update'}</button>
        <button type="button" onClick={() => navigate(-1)}>Back</button>
      </form>
    </div>
  );
}
