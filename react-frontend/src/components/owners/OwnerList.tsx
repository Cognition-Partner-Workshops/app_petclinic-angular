import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Owner } from '../../types';
import { getOwners } from '../../api/ownerService';

export default function OwnerList() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchOwners = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await getOwners();
        if (!cancelled) {
          setOwners(data);
        }
      } catch {
        if (!cancelled) {
          setErrorMessage('Failed to load owners.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };
    fetchOwners();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = () => {
    setIsLoading(true);
    setErrorMessage(null);
    getOwners(search)
      .then((data) => {
        setOwners(data);
      })
      .catch(() => {
        setErrorMessage('Failed to search owners.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h2>Owners</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="ownerSearch">Search by last name:</label>{' '}
        <input
          id="ownerSearch"
          aria-label="Search by last name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />{' '}
        <button onClick={handleSearch}>Search</button>{' '}
        <button onClick={() => navigate('/owners/add')}>Add Owner</button>
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && owners.length === 0 && <p>No owners found.</p>}
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
            {owners.map((o) => (
              <tr key={o.id}>
                <td>
                  <Link to={`/owners/${o.id}`}>
                    {o.firstName} {o.lastName}
                  </Link>
                </td>
                <td>{o.address}</td>
                <td>{o.city}</td>
                <td>{o.telephone}</td>
                <td>{o.pets?.map((p) => p.name).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
