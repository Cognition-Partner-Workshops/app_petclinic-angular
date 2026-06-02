import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vetService } from '../../api/vetService';
import { specialtyService } from '../../api/specialtyService';
import { extractErrorMessage } from '../../api/httpClient';
import type { Specialty } from '../../types';

function VetEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<number[]>([]);
  const [specList, setSpecList] = useState<Specialty[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    specialtyService.getSpecialties().then(setSpecList).catch((err) => setErrorMessage(extractErrorMessage(err)));
    if (id) {
      vetService.getVetById(Number(id)).then((vet) => {
        setFirstName(vet.firstName || '');
        setLastName(vet.lastName || '');
        setSelectedSpecialtyIds(vet.specialties?.map((s) => s.id) || []);
      }).catch((err) => setErrorMessage(extractErrorMessage(err)));
    }
  }, [id]);

  const errors: Record<string, string> = {};
  if (!firstName) errors.firstName = 'First name is required';
  else if (firstName.length < 2) errors.firstName = 'First name must be at least 2 characters';
  if (!lastName) errors.lastName = 'Last name is required';
  else if (lastName.length < 2) errors.lastName = 'Last name must be at least 2 characters';

  const isValid = Object.keys(errors).length === 0;

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSpecChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const options = e.target.options;
    const selected: number[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(Number(options[i].value));
    }
    setSelectedSpecialtyIds(selected);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true });
    if (!isValid || !id || (selectedSpecialtyIds.length > 0 && specList.length === 0)) return;
    const specialties = specList.filter((s) => selectedSpecialtyIds.includes(s.id));
    vetService.updateVet(Number(id), { id: Number(id), firstName, lastName, specialties })
      .then(() => navigate('/vets'))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>Edit Vet</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={`form-group ${touched.firstName && errors.firstName ? 'has-error' : ''}`}>
          <label className="col-label">First Name</label>
          <input className="form-control" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} onBlur={() => handleBlur('firstName')} />
          {touched.firstName && errors.firstName && <span className="help-block">{errors.firstName}</span>}
        </div>
        <div className={`form-group ${touched.lastName && errors.lastName ? 'has-error' : ''}`}>
          <label className="col-label">Last Name</label>
          <input className="form-control" value={lastName}
            onChange={(e) => setLastName(e.target.value)} onBlur={() => handleBlur('lastName')} />
          {touched.lastName && errors.lastName && <span className="help-block">{errors.lastName}</span>}
        </div>
        <div className="form-group">
          <label className="col-label">Specialties</label>
          <select className="form-control" multiple value={selectedSpecialtyIds.map(String)} onChange={handleSpecChange}>
            {specList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/vets')}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>Update Vet</button>
        </div>
      </form>
    </div>
  );
}

export default VetEdit;
