import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { petService } from '../../api/petService';
import { petTypeService } from '../../api/petTypeService';
import { ownerService } from '../../api/ownerService';
import { extractErrorMessage } from '../../api/httpClient';
import type { Owner, PetType } from '../../types';

function PetEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [typeId, setTypeId] = useState<number | ''>('');
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    petTypeService.getPetTypes().then(setPetTypes).catch((err) => setErrorMessage(extractErrorMessage(err)));
    if (id) {
      petService.getPetById(Number(id)).then((pet) => {
        setName(pet.name || '');
        setBirthDate(pet.birthDate || '');
        setTypeId(pet.type?.id || '');
        if (pet.ownerId) {
          ownerService.getOwnerById(pet.ownerId).then(setCurrentOwner);
        }
      }).catch((err) => setErrorMessage(extractErrorMessage(err)));
    }
  }, [id]);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Name is required';
  if (!birthDate) errors.birthDate = 'Birth Date is required';
  if (!typeId) errors.type = 'Pet type is required';

  const isValid = Object.keys(errors).length === 0;

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, birthDate: true, type: true });
    if (!isValid || !id) return;
    const selectedType = petTypes.find((t) => t.id === typeId);
    petService.updatePet(Number(id), {
      id: Number(id),
      name,
      birthDate,
      type: selectedType,
      owner: currentOwner || undefined,
    })
      .then(() => navigate(currentOwner ? `/owners/${currentOwner.id}` : '/owners'))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>Edit Pet</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-label">Owner</label>
          <input className="form-control" readOnly
            value={currentOwner ? `${currentOwner.firstName} ${currentOwner.lastName}` : ''} />
        </div>
        <div className={`form-group ${touched.name && errors.name ? 'has-error' : ''}`}>
          <label className="col-label">Name</label>
          <input className="form-control" value={name} maxLength={30}
            onChange={(e) => setName(e.target.value)} onBlur={() => handleBlur('name')} />
          {touched.name && errors.name && <span className="help-block">{errors.name}</span>}
        </div>
        <div className={`form-group ${touched.birthDate && errors.birthDate ? 'has-error' : ''}`}>
          <label className="col-label">Birth Date</label>
          <input type="date" className="form-control" value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)} onBlur={() => handleBlur('birthDate')} />
          {touched.birthDate && errors.birthDate && <span className="help-block">{errors.birthDate}</span>}
        </div>
        <div className={`form-group ${touched.type && errors.type ? 'has-error' : ''}`}>
          <label className="col-label">Type</label>
          <select className="form-control" value={typeId}
            onChange={(e) => setTypeId(Number(e.target.value))} onBlur={() => handleBlur('type')}>
            <option value="">-- Select --</option>
            {petTypes.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          {touched.type && errors.type && <span className="help-block">{errors.type}</span>}
        </div>
        <div className="form-actions">
          <button type="button" className="btn"
            onClick={() => navigate(currentOwner ? `/owners/${currentOwner.id}` : '/owners')}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>Update Pet</button>
        </div>
      </form>
    </div>
  );
}

export default PetEdit;
