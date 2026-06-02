import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { specialtyService } from '../../api/specialtyService';
import { extractErrorMessage } from '../../api/httpClient';

function SpecialtyEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (id) {
      specialtyService.getSpecialtyById(Number(id)).then((spec) => {
        setName(spec.name || '');
      }).catch((err) => setErrorMessage(extractErrorMessage(err)));
    }
  }, [id]);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Name is required';

  const isValid = Object.keys(errors).length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid || !id) return;
    specialtyService.updateSpecialty(Number(id), { id: Number(id), name })
      .then(() => navigate('/specialties'))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>Edit Specialty</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={`form-group ${touched && errors.name ? 'has-error' : ''}`}>
          <label className="col-label">Name</label>
          <input className="form-control" value={name} maxLength={80}
            onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} />
          {touched && errors.name && <span className="help-block">{errors.name}</span>}
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/specialties')}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>Update</button>
        </div>
      </form>
    </div>
  );
}

export default SpecialtyEdit;
