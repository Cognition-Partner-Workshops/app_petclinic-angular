import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOwners, searchOwners } from '../../services/api';
import type { Owner } from '../../types';

export default function OwnerList() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setError(null);
    getOwners()
      .then((data) => {
        setOwners(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to load owners.');
        setIsLoading(false);
      });
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    setError(null);
    searchOwners(searchTerm)
      .then((data) => {
        setOwners(data);
        setIsLoading(false);
      })
      .catch(() => {
        setError('Failed to search owners.');
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Owners</h1>
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      <div>
        <label htmlFor="search-last-name">Last Name</label>
        <input
          id="search-last-name"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <Link to="/owners/new">Add Owner</Link>
      {!isLoading && owners.length === 0 && <p>No owners found</p>}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
