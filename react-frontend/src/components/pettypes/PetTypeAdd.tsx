import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { petTypeService } from '../../api/petTypeService';
import { extractErrorMessage } from '../../api/httpClient';

function PetTypeAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState(false);

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Name is required';
  else if (name.length > 80) errors.name = 'Name may be at most 80 characters long';

  const isValid = Object.keys(errors).length === 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    petTypeService.addPetType({ name })
      .then(() => navigate('/pettypes'))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>New Pet Type</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={`form-group ${touched && errors.name ? 'has-error' : ''}`}>
          <label className="col-label">Name</label>
          <input className="form-control" value={name} maxLength={80}
            onChange={(e) => setName(e.target.value)} onBlur={() => setTouched(true)} />
          {touched && errors.name && <span className="help-block">{errors.name}</span>}
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/pettypes')}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>Save</button>
        </div>
      </form>
    </div>
  );
}

export default PetTypeAdd;
