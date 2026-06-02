import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Owner } from '../../types';
import { getOwnerById, deleteOwner } from '../../services/ownerService';
import { deletePet } from '../../services/petService';
import { deleteVisit } from '../../services/visitService';

export default function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getOwnerById(Number(id))
        .then((data) => setOwner(data))
        .catch((err: string) => setErrorMessage(err));
    }
  }, [id]);

  function handleDeleteOwner() {
    if (id && confirm('Are you sure you want to delete this owner?')) {
      deleteOwner(Number(id))
        .then(() => navigate('/owners'))
        .catch((err: string) => setErrorMessage(err));
    }
  }

  function handleDeletePet(petId: number) {
    if (confirm('Are you sure you want to delete this pet?')) {
      deletePet(petId)
        .then(() => {
          if (id) {
            getOwnerById(Number(id)).then((data) => setOwner(data));
          }
        })
        .catch((err: string) => setErrorMessage(err));
    }
  }

  function handleDeleteVisit(visitId: number) {
    if (confirm('Are you sure you want to delete this visit?')) {
      deleteVisit(visitId)
        .then(() => {
          if (id) {
            getOwnerById(Number(id)).then((data) => setOwner(data));
          }
        })
        .catch((err: string) => setErrorMessage(err));
    }
  }

  if (!owner) {
    return <div className="container xd-container">{errorMessage || 'Loading...'}</div>;
  }

  return (
    <div className="container xd-container">
      <h2>Owner Information</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

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
      <button className="btn btn-danger" onClick={handleDeleteOwner}>
        Delete Owner
      </button>

      <br />
      <br />
      <br />
      <h2>Pets and Visits</h2>

      {owner.pets?.map((pet) => (
        <table key={pet.id} className="table table-striped">
          <tbody>
            <tr>
              <td valign="top">
                <dl className="dl-horizontal">
                  <dt>Name</dt>
                  <dd>{pet.name}</dd>
                  <dt>Birth Date</dt>
                  <dd>{pet.birthDate}</dd>
                  <dt>Type</dt>
                  <dd>{pet.type?.name}</dd>
                </dl>
                <button className="btn btn-default" onClick={() => navigate(`/pets/${pet.id}/edit`)}>
                  Edit Pet
                </button>
                <button className="btn btn-default" onClick={() => handleDeletePet(pet.id)}>
                  Delete Pet
                </button>
                <button className="btn btn-default" onClick={() => navigate(`/pets/${pet.id}/visits/add`)}>
                  Add Visit
                </button>
              </td>
              <td valign="top">
                {pet.visits && pet.visits.length > 0 && (
                  <table className="table table-condensed">
                    <thead>
                      <tr>
                        <th>Visit Date</th>
                        <th>Description</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pet.visits.map((visit) => (
                        <tr key={visit.id}>
                          <td>{visit.date}</td>
                          <td>{visit.description}</td>
                          <td>
                            <button
                              className="btn btn-default btn-sm"
                              onClick={() => navigate(`/visits/${visit.id}/edit`)}
                            >
                              Edit Visit
                            </button>
                            <button
                              className="btn btn-default btn-sm"
                              onClick={() => handleDeleteVisit(visit.id)}
                            >
                              Delete Visit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </div>
  );
}
