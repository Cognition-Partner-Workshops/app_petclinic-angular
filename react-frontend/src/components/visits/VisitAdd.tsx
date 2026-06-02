import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { visitService } from '../../api/visitService';
import { petService } from '../../api/petService';
import { ownerService } from '../../api/ownerService';
import { extractErrorMessage } from '../../api/httpClient';
import type { Pet, Owner } from '../../types';

function VisitAdd() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      petService.getPetById(Number(id)).then((pet) => {
        setCurrentPet(pet);
        if (pet.ownerId) {
          ownerService.getOwnerById(pet.ownerId).then(setCurrentOwner);
        }
      }).catch((err) => setErrorMessage(extractErrorMessage(err)));
    }
  }, [id]);

  const errors: Record<string, string> = {};
  if (!date) errors.date = 'Date is required';
  if (!description) errors.description = 'Description is required';

  const isValid = Object.keys(errors).length === 0;

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ date: true, description: true });
    if (!isValid || !currentPet || !currentOwner) return;
    visitService.addVisit(currentOwner.id, currentPet.id, {
      date,
      description,
      pet: currentPet,
    })
      .then(() => navigate(`/owners/${currentOwner.id}`))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>New Visit</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-label">Pet</label>
          <input className="form-control" readOnly value={currentPet?.name || ''} />
        </div>
        <div className="form-group">
          <label className="col-label">Owner</label>
          <input className="form-control" readOnly
            value={currentOwner ? `${currentOwner.firstName} ${currentOwner.lastName}` : ''} />
        </div>
        <div className={`form-group ${touched.date && errors.date ? 'has-error' : ''}`}>
          <label className="col-label">Date</label>
          <input type="date" className="form-control" value={date}
            onChange={(e) => setDate(e.target.value)} onBlur={() => handleBlur('date')} />
          {touched.date && errors.date && <span className="help-block">{errors.date}</span>}
        </div>
        <div className={`form-group ${touched.description && errors.description ? 'has-error' : ''}`}>
          <label className="col-label">Description</label>
          <input className="form-control" value={description}
            onChange={(e) => setDescription(e.target.value)} onBlur={() => handleBlur('description')} />
          {touched.description && errors.description && <span className="help-block">{errors.description}</span>}
        </div>
        <div className="form-actions">
          <button type="button" className="btn"
            onClick={() => navigate(currentOwner ? `/owners/${currentOwner.id}` : '/visits')}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>Save Visit</button>
        </div>
      </form>
    </div>
  );
}

export default VisitAdd;
