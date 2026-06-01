import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet, PetType, Owner } from '../../types';
import { getPetById, updatePet } from '../../api/pets';
import { getPetTypes } from '../../api/petTypes';
import { getOwnerById } from '../../api/owners';

export default function PetEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<number | ''>('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getPetTypes()
      .then(setPetTypes)
      .catch((err) => setErrorMessage(String(err)));

    if (id) {
      getPetById(Number(id)).then((p) => {
        setPet(p);
        setSelectedTypeId(p.type?.id || '');
        if (p.ownerId) {
          getOwnerById(p.ownerId).then(setCurrentOwner).catch((err) => setErrorMessage(String(err)));
        }
      }).catch((err) => setErrorMessage(String(err)));
    }
  }, [id]);

  if (!pet) return <div>Loading...</div>;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const petType = petTypes.find((t) => t.id === Number(selectedTypeId));
    if (!petType) return;
    updatePet(pet.id, { ...pet, type: petType, birthDate: pet.birthDate })
      .then(() => {
        if (currentOwner) navigate(`/owners/${currentOwner.id}`);
        else navigate('/owners');
      })
      .catch((err) => setErrorMessage(String(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Pet</h2>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
        {currentOwner && (
          <p>
            <b>Owner:</b> {currentOwner.firstName} {currentOwner.lastName}
          </p>
        )}
        <form onSubmit={handleSubmit} className="form-horizontal">
          <div className="form-group">
            <label htmlFor="name" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="name" value={pet.name || ''} onChange={(e) => setPet({ ...pet, name: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="birthDate" className="col-sm-2 control-label">Birth Date</label>
            <div className="col-sm-10">
              <input type="date" className="form-control" id="birthDate" value={pet.birthDate || ''} onChange={(e) => setPet({ ...pet, birthDate: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="type" className="col-sm-2 control-label">Type</label>
            <div className="col-sm-10">
              <select className="form-control" id="type" value={selectedTypeId} onChange={(e) => setSelectedTypeId(Number(e.target.value))} required>
                <option value="">Select a type</option>
                {petTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">Update Pet</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
