import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Owner } from '../../types';
import { getOwners, searchOwners } from '../../api/owners';

export default function OwnerList() {
  const navigate = useNavigate();
  const [owners, setOwners] = useState<Owner[] | null>(null);
  const [lastName, setLastName] = useState('');
  const [isDataReceived, setIsDataReceived] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getOwners()
      .then((data) => setOwners(data))
      .catch((err) => setErrorMessage(String(err)))
      .finally(() => setIsDataReceived(true));
  }, []);

  const handleSearch = () => {
    if (lastName === '') {
      getOwners()
        .then((data) => setOwners(data))
        .catch((err) => setErrorMessage(String(err)));
    } else {
      searchOwners(lastName)
        .then((data) => setOwners(data))
        .catch((err) => setErrorMessage(String(err)));
    }
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Owners</h2>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
        <form
          className="form-horizontal"
          id="search-owner-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
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
              <button type="submit" className="btn btn-default">
                Find Owner
              </button>
            </div>
          </div>
        </form>

        {isDataReceived && !errorMessage && (owners === null || (owners && owners.length === 0 && lastName)) && (
          <div>No owners with LastName starting with &quot;{lastName}&quot;</div>
        )}

        {owners && owners.length > 0 && (
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
                      <a
                        href={`/owners/${owner.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/owners/${owner.id}`);
                        }}
                      >
                        {owner.firstName} {owner.lastName}
                      </a>
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
                <button
                  className="btn btn-default"
                  onClick={() => navigate('/owners/add')}
                >
                  Add Owner
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
