import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchOwners } from '../../hooks/useOwners';

export default function OwnerList() {
  const [lastName, setLastName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { data: owners, isLoading } = useSearchOwners(searchTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(lastName);
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Owners</h2>
        <form method="get" className="form-horizontal" id="search-owner-form" onSubmit={handleSearch}>
          <div className="form-group">
            <div className="control-group" id="lastNameGroup">
              <label className="col-sm-2 control-label">Last name </label>
              <div className="col-sm-10">
                <input
                  className="form-control"
                  size={30}
                  maxLength={80}
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <span className="help-inline"></span>
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

        {!isLoading && owners && owners.length === 0 && (
          <div>No owners with LastName starting with "{searchTerm}"</div>
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
            <div>
              <button className="btn btn-default" onClick={() => navigate('/owners/add')}>
                Add Owner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
