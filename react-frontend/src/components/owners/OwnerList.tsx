import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Owner } from '../../types';
import { getOwners, searchOwners } from '../../services/ownerService';

export default function OwnerList() {
  const [owners, setOwners] = useState<Owner[] | null>(null);
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDataReceived, setIsDataReceived] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getOwners()
      .then((data) => {
        setOwners(data);
      })
      .catch((err: string) => setErrorMessage(err))
      .finally(() => setIsDataReceived(true));
  }, []);

  function handleSearch() {
    setErrorMessage('');
    if (lastName === '') {
      getOwners()
        .then((data) => setOwners(data))
        .catch((err: string) => setErrorMessage(err));
    } else {
      searchOwners(lastName)
        .then((data) => setOwners(data))
        .catch(() => setOwners(null));
    }
  }

  return (
    <div className="container xd-container">
      <h2>Owners</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form className="form-horizontal" id="search-owner-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <div className="control-group" id="lastNameGroup">
            <label className="col-sm-2 control-label">Last name</label>
            <div className="col-sm-10">
              <input
                className="form-control"
                maxLength={80}
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button type="button" className="btn btn-default" onClick={handleSearch}>
              Find Owner
            </button>
          </div>
        </div>
      </form>

      {isDataReceived && owners === null && !errorMessage && (
        <div>No owners with LastName starting with &quot;{lastName}&quot;</div>
      )}

      {owners && (
        <div className="table-responsive" id="ownersTable">
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
                  <td className="ownerFullName">
                    <Link to={`/owners/${owner.id}`}>
                      {owner.firstName} {owner.lastName}
                    </Link>
                  </td>
                  <td>{owner.address}</td>
                  <td>{owner.city}</td>
                  <td>{owner.telephone}</td>
                  <td>
                    {owner.pets?.map((pet) => (
                      <div key={pet.id}>{pet.name}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isDataReceived && (
            <div>
              <button className="btn btn-default" onClick={() => navigate('/owners/add')}>
                Add Owner
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
