import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ownerService } from '../../api/ownerService';
import { extractErrorMessage } from '../../api/httpClient';
import { petService } from '../../api/petService';
import type { Owner, Pet } from '../../types';

function PetCard({ pet, onDelete }: { pet: Pet; onDelete: (p: Pet) => void }) {
  const navigate = useNavigate();
  return (
    <div className="pet-card">
      <h4>{pet.name}</h4>
      <p>Birth Date: {pet.birthDate}</p>
      <p>Type: {pet.type?.name}</p>
      {pet.visits && pet.visits.length > 0 && (
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Description</th></tr>
          </thead>
          <tbody>
            {pet.visits.map((v) => (
              <tr key={v.id}><td>{v.date}</td><td>{v.description}</td></tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="form-actions">
        <button className="btn btn-sm" onClick={() => navigate(`/pets/${pet.id}/edit`)}>Edit Pet</button>
        <button className="btn btn-sm" onClick={() => onDelete(pet)}>Delete Pet</button>
        <button className="btn btn-sm" onClick={() => navigate(`/pets/${pet.id}/visits/add`)}>Add Visit</button>
      </div>
    </div>
  );
}

function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      ownerService.getOwnerById(Number(id))
        .then(setOwner)
        .catch((err) => setErrorMessage(extractErrorMessage(err)));
    }
  }, [id]);

  function handleDeletePet(pet: Pet) {
    petService.deletePet(pet.id)
      .then(() => {
        if (owner) {
          setOwner({ ...owner, pets: owner.pets.filter((p) => p.id !== pet.id) });
        }
      })
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  if (!owner) return <div className="container">{errorMessage || 'Loading...'}</div>;

  return (
    <div className="container">
      <h2>Owner Information</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <table className="table table-striped">
        <tbody>
          <tr><th>Name</th><td><b>{owner.firstName} {owner.lastName}</b></td></tr>
          <tr><th>Address</th><td>{owner.address}</td></tr>
          <tr><th>City</th><td>{owner.city}</td></tr>
          <tr><th>Telephone</th><td>{owner.telephone}</td></tr>
        </tbody>
      </table>

      <div className="form-actions">
        <button className="btn" onClick={() => navigate('/owners')}>Back</button>
        <button className="btn" onClick={() => navigate(`/owners/${owner.id}/edit`)}>Edit Owner</button>
        <Link className="btn" to={`/owners/${owner.id}/pets/add`}>Add New Pet</Link>
      </div>

      <h2>Pets and Visits</h2>
      {owner.pets?.map((pet) => (
        <PetCard key={pet.id} pet={pet} onDelete={handleDeletePet} />
      ))}
    </div>
  );
}

export default OwnerDetail;
