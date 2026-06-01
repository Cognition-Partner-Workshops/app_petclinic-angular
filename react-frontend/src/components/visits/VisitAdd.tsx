import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet, Owner, PetType } from '../../types';
import { getPetById } from '../../api/pets';
import { getOwnerById } from '../../api/owners';
import { addVisit } from '../../api/visits';

export default function VisitAdd() {
  const { id: petId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [currentPetType, setCurrentPetType] = useState<PetType | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!petId) return;
    getPetById(Number(petId)).then((pet) => {
      setCurrentPet(pet);
      setCurrentPetType(pet.type);
      if (pet.ownerId) {
        getOwnerById(pet.ownerId).then(setCurrentOwner);
      }
    }).catch((err) => setErrorMessage(String(err)));
  }, [petId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentPet || !currentOwner) return;
    addVisit(currentOwner.id, currentPet.id, {
      date,
      description,
      pet: currentPet,
    })
      .then(() => navigate(`/owners/${currentOwner.id}`))
      .catch((err) => setErrorMessage(String(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Visit</h2>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
        {currentPet && (
          <table className="table table-striped">
            <tbody>
              <tr>
                <th>Name</th>
                <td>{currentPet.name}</td>
              </tr>
              <tr>
                <th>Birth Date</th>
                <td>{currentPet.birthDate}</td>
              </tr>
              <tr>
                <th>Type</th>
                <td>{currentPetType?.name}</td>
              </tr>
              <tr>
                <th>Owner</th>
                <td>{currentOwner ? `${currentOwner.firstName} ${currentOwner.lastName}` : ''}</td>
              </tr>
            </tbody>
          </table>
        )}
        <form onSubmit={handleSubmit} className="form-horizontal">
          <div className="form-group">
            <label htmlFor="date" className="col-sm-2 control-label">Date</label>
            <div className="col-sm-10">
              <input type="date" className="form-control" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description" className="col-sm-2 control-label">Description</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">Add Visit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
