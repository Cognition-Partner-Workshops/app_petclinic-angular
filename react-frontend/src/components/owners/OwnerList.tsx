import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOwners, searchOwners } from '../../services/api';
import type { Owner } from '../../types';

export default function OwnerList() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setErrorMessage(null);

    const request = searchTerm.trim()
      ? searchOwners(searchTerm.trim())
      : getOwners();

    request
      .then((data) => {
        if (!cancelled) {
          setOwners(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load owners';
          setErrorMessage(message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [searchTerm]);

  return (
    <div>
      <h2>Owners</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="owner-search">Search by last name:</label>{' '}
        <input
          id="owner-search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Last name"
        />
        <Link to="/owners/add" style={{ marginLeft: '1rem' }}>
          Add Owner
        </Link>
      </div>

      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          {errorMessage}{' '}
          <button type="button" onClick={() => setErrorMessage(null)}>
            Dismiss
          </button>
        </div>
      )}

      {isLoading && <p>Loading...</p>}

      {!isLoading && !errorMessage && owners.length === 0 && (
        <p>No owners found.</p>
      )}

      {!isLoading && owners.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Telephone</th>
              <th>Pets</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner) => (
              <tr key={owner.id}>
                <td>
                  <Link to={`/owners/${owner.id}`}>
                    {owner.firstName} {owner.lastName}
                  </Link>
                </td>
                <td>{owner.address}</td>
                <td>{owner.city}</td>
                <td>{owner.telephone}</td>
                <td>
                  {owner.pets.map((pet) => pet.name).join(', ') || 'None'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
