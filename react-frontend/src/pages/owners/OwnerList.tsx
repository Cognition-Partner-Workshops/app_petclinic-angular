import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Owner } from '../../types';
import { getOwners, searchOwners } from '../../api/ownerApi';
import { extractErrorMessage } from '../../api/errorUtils';

export default function OwnerList() {
  const [owners, setOwners] = useState<Owner[] | null>(null);
  const [lastName, setLastName] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getOwners()
      .then((data) => setOwners(data))
      .catch((err) => setErrorMessage(extractErrorMessage(err)))
      .finally(() => setLoaded(true));
  }, []);

  const handleSearch = () => {
    if (lastName === '') {
      getOwners()
        .then((data) => setOwners(data))
        .catch((err) => setErrorMessage(extractErrorMessage(err)));
    } else {
      searchOwners(lastName)
        .then((data) => setOwners(data))
        .catch(() => setOwners(null));
    }
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Owners</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form
          className="form-horizontal"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="form-group">
            <label className="col-sm-2 control-label">Last name</label>
            <div className="col-sm-10">
              <input
                className="form-control"
                maxLength={80}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">
                Find Owner
              </button>
            </div>
          </div>
        </form>

        {owners === null && (
          <div>No owners with LastName starting with &quot;{lastName}&quot;</div>
        )}

        {owners && (
          <div className="table-responsive">
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
                    <td>
                      {owner.pets?.map((pet) => (
                        <span key={pet.id}>{pet.name} </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loaded && (
              <button
                className="btn btn-default"
                onClick={() => navigate('/owners/add')}
              >
                Add Owner
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
