import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../../api/vetService';
import { specialtyService } from '../../api/specialtyService';
import { extractErrorMessage } from '../../api/httpClient';
import type { Specialty } from '../../types';

function VetAdd() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<number | ''>('');
  const [specialtiesList, setSpecialtiesList] = useState<Specialty[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    specialtyService.getSpecialties()
      .then(setSpecialtiesList)
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }, []);

  const errors: Record<string, string> = {};
  if (!firstName) errors.firstName = 'First name is required';
  else if (firstName.length < 2) errors.firstName = 'First name must be at least 2 characters';
  if (!lastName) errors.lastName = 'Last name is required';
  else if (lastName.length < 2) errors.lastName = 'Last name must be at least 2 characters';

  const isValid = Object.keys(errors).length === 0;

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true });
    if (!isValid) return;
    const specialties = selectedSpecialtyId
      ? [specialtiesList.find((s) => s.id === selectedSpecialtyId)!]
      : [];
    vetService.addVet({ firstName, lastName, specialties })
      .then(() => navigate('/vets'))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>New Vet</h2>
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
          <label className="col-label">Specialty</label>
          <select className="form-control" value={selectedSpecialtyId}
            onChange={(e) => setSelectedSpecialtyId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">-- None --</option>
            {specialtiesList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/vets')}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>Save Vet</button>
        </div>
      </form>
    </div>
  );
}

export default VetAdd;
