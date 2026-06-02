import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Pet } from '../../types';
import { getPets, deletePet } from '../../api/petApi';
import { extractErrorMessage } from '../../api/errorUtils';

export default function PetList() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPets()
      .then((data) => setPets(data))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }, []);

  const handleDelete = (pet: Pet) => {
    deletePet(pet.id)
      .then(() => setPets((prev) => prev.filter((p) => p.id !== pet.id)))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Pets</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Type</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.birthDate}</td>
                <td>{pet.type?.name}</td>
                <td>
                  {pet.owner
                    ? `${pet.owner.firstName} ${pet.owner.lastName}`
                    : ''}
                </td>
                <td>
                  <button
                    className="btn btn-default"
                    onClick={() => navigate(`/pets/${pet.id}/edit`)}
                  >
                    Edit Pet
                  </button>
                  <button
                    className="btn btn-default"
                    onClick={() => handleDelete(pet)}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
