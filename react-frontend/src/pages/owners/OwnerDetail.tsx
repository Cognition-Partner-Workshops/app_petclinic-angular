import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { Owner } from '../../types';
import { getOwnerById } from '../../api/ownerApi';
import { deleteVisit } from '../../api/visitApi';
import { deletePet } from '../../api/petApi';
import { extractErrorMessage } from '../../api/errorUtils';

export default function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    getOwnerById(Number(id))
      .then((data) => setOwner(data))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }, [id]);

  const handleDeletePet = (petId: number) => {
    deletePet(petId)
      .then(() => {
        if (owner) {
          setOwner({ ...owner, pets: owner.pets.filter((p) => p.id !== petId) });
        }
      })
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  };

  const handleDeleteVisit = (visitId: number, petId: number) => {
    deleteVisit(visitId)
      .then(() => {
        if (owner) {
          setOwner({
            ...owner,
            pets: owner.pets.map((p) =>
              p.id === petId
                ? { ...p, visits: p.visits.filter((v) => v.id !== visitId) }
                : p
            ),
          });
        }
      })
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  };

  if (!owner && !errorMessage) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Owner Information</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        {owner && (
          <>
            <table className="table table-striped">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>
                    <b>
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
            <button
              className="btn btn-default"
              onClick={() => navigate(`/owners/${owner.id}/edit`)}
            >
              Edit Owner
            </button>
            <button
              className="btn btn-default"
              onClick={() => navigate(`/owners/${owner.id}/pets/add`)}
            >
              Add New Pet
            </button>

            <br />
            <br />
            <br />
            <h2>Pets and Visits</h2>

            <table className="table table-striped">
              <tbody>
                {owner.pets?.map((pet) => (
                  <tr key={pet.id}>
                    <td valign="top">
                      <dl className="dl-horizontal">
                        <dt>Name</dt>
                        <dd>{pet.name}</dd>
                        <dt>Birth Date</dt>
                        <dd>{pet.birthDate}</dd>
                        <dt>Type</dt>
                        <dd>{pet.type?.name}</dd>
                      </dl>
                      <button
                        className="btn btn-default"
                        onClick={() => navigate(`/pets/${pet.id}/edit`)}
                      >
                        Edit Pet
                      </button>
                      <button
                        className="btn btn-default"
                        onClick={() => handleDeletePet(pet.id)}
                      >
                        Delete Pet
                      </button>
                      <button
                        className="btn btn-default"
                        onClick={() =>
                          navigate(`/pets/${pet.id}/visits/add`)
                        }
                      >
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
                                  <Link to={`/visits/${visit.id}/edit`}>
                                    <button className="btn btn-default">
                                      Edit Visit
                                    </button>
                                  </Link>
                                  <button
                                    className="btn btn-default"
                                    onClick={() =>
                                      handleDeleteVisit(visit.id, pet.id)
                                    }
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
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
