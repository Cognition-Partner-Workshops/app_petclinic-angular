import { useState } from 'react';
import type { Owner } from '../types';

const API = 'http://localhost:9966/petclinic/api';

interface OwnerFormProps {
  owner?: Owner;
}

export function OwnerForm({ owner }: OwnerFormProps) {
  const [firstName, setFirstName] = useState(owner?.firstName ?? '');
  const [lastName, setLastName] = useState(owner?.lastName ?? '');
  const [address, setAddress] = useState(owner?.address ?? '');
  const [city, setCity] = useState(owner?.city ?? '');
  const [telephone, setTelephone] = useState(owner?.telephone ?? '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const body = { firstName, lastName, address, city, telephone };

    try {
      const url = owner ? `${API}/owners/${owner.id}` : `${API}/owners`;
      const method = owner ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errHeader = res.headers.get('errors');
        if (errHeader) {
          const parsed = JSON.parse(errHeader) as { errorMessage: string }[];
          throw new Error(parsed[0].errorMessage);
        }
        throw new Error(`Error ${res.status}`);
      }

      setSuccess(owner ? 'Owner updated' : 'Owner created');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  const handleDelete = async () => {
    if (!owner) return;
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API}/owners/${owner.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      setSuccess('Owner deleted');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{owner ? 'Edit Owner' : 'New Owner'}</h1>
      {error && <p role="alert">{error}</p>}
      {success && <p role="status">{success}</p>}
      <label>
        First Name
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <label>
        Last Name
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </label>
      <label>
        Address
        <input value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      <label>
        City
        <input value={city} onChange={(e) => setCity(e.target.value)} />
      </label>
      <label>
        Telephone
        <input value={telephone} onChange={(e) => setTelephone(e.target.value)} />
      </label>
      <button type="submit">{owner ? 'Update' : 'Create'}</button>
      {owner && (
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      )}
    </form>
  );
}
