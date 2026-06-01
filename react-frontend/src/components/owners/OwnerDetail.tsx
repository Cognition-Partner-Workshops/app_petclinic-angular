import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Owner } from '../../types';
import { getOwnerById } from '../../api/owners';
import PetListItem from '../pets/PetListItem';

export default function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    getOwnerById(Number(id))
      .then(setOwner)
      .catch((err) => setErrorMessage(String(err)));
  }, [id]);

  if (errorMessage) return <div className="alert alert-warning">{errorMessage}</div>;
  if (!owner) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Owner Information</h2>
        <table className="table table-striped">
          <tbody>
            <tr>
              <th>Name</th>
              <td>
                <b className="ownerFullName">
                  {owner.firstName} {owner.lastName}
                </b>
              </td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{owner.address}</td>
            </tr>
            <tr>
              <th>City</th>
              <td>{owner.city}</td>
            </tr>
            <tr>
              <th>Telephone</th>
              <td>{owner.telephone}</td>
            </tr>
          </tbody>
        </table>

        <button className="btn btn-default" onClick={() => navigate('/owners')}>
          Back
        </button>
        <button className="btn btn-default" onClick={() => navigate(`/owners/${owner.id}/edit`)}>
          Edit Owner
        </button>
        <button className="btn btn-default" onClick={() => navigate(`/owners/${owner.id}/pets/add`)}>
          Add New Pet
        </button>

        <br /><br /><br />
        <h2>Pets and Visits</h2>
        <table className="table table-striped">
          <tbody>
            {owner.pets?.map((pet) => (
              <tr key={pet.id}>
                <PetListItem pet={pet} onPetDeleted={() => {
                  setOwner(prev => prev ? ({
                    ...prev,
                    pets: prev.pets.filter((p) => p.id !== pet.id),
                  }) : prev);
                }} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
