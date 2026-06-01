import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PetType, Owner } from '../../types';
import { getOwnerById } from '../../api/owners';
import { addPet } from '../../api/pets';
import { getPetTypes } from '../../api/petTypes';

export default function PetAdd() {
  const { id: ownerId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<number | ''>('');
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getPetTypes()
      .then(setPetTypes)
      .catch((err) => setErrorMessage(String(err)));
    if (ownerId) {
      getOwnerById(Number(ownerId))
        .then(setCurrentOwner)
        .catch((err) => setErrorMessage(String(err)));
    }
  }, [ownerId]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentOwner || !selectedTypeId) return;
    const petType = petTypes.find((t) => t.id === Number(selectedTypeId));
    if (!petType) return;
    addPet(currentOwner.id, {
      name,
      birthDate,
      type: petType,
      owner: currentOwner,
    })
      .then(() => navigate(`/owners/${currentOwner.id}`))
      .catch((err) => setErrorMessage(String(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Pet</h2>
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
              <input type="text" className="form-control" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="birthDate" className="col-sm-2 control-label">Birth Date</label>
            <div className="col-sm-10">
              <input type="date" className="form-control" id="birthDate" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
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
              <button type="submit" className="btn btn-default">Add Pet</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
