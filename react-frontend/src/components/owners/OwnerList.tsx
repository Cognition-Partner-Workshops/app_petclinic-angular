import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ownerService } from '../../api/ownerService';
import { extractErrorMessage } from '../../api/httpClient';
import type { Owner } from '../../types';

function OwnerList() {
  const [owners, setOwners] = useState<Owner[] | null>(null);
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    ownerService.getOwners()
      .then((data) => { setOwners(data); setLoaded(true); })
      .catch((err) => { setErrorMessage(extractErrorMessage(err)); setLoaded(true); });
  }, []);

  function searchByLastName() {
    setErrorMessage('');
    if (!lastName) {
      ownerService.getOwners().then(setOwners).catch((err) => setErrorMessage(extractErrorMessage(err)));
    } else {
      ownerService.searchOwners(lastName)
        .then(setOwners)
        .catch((err) => { setErrorMessage(extractErrorMessage(err)); setOwners(null); });
    }
  }

  return (
    <div className="container">
      <h2>Owners</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form className="form-horizontal" onSubmit={(e) => { e.preventDefault(); searchByLastName(); }}>
        <div className="form-group">
          <label className="col-label">Last name</label>
          <input
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn">Find Owner</button>
        </div>
      </form>

      {owners !== null && owners.length === 0 && loaded && !errorMessage && (
        <div>No owners with LastName starting with &quot;{lastName}&quot;</div>
      )}

      {owners && owners.length > 0 && (
        <table className="table table-striped">
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
                <td>{owner.pets?.map((p) => p.name).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {loaded && (
        <button className="btn" onClick={() => navigate('/owners/add')}>Add Owner</button>
      )}
    </div>
  );
}

export default OwnerList;
