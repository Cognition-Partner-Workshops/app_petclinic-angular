import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ownerService } from '../../api/ownerService';
import { extractErrorMessage } from '../../api/httpClient';

function OwnerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      ownerService.getOwnerById(Number(id)).then((owner) => {
        setFirstName(owner.firstName || '');
        setLastName(owner.lastName || '');
        setAddress(owner.address || '');
        setCity(owner.city || '');
        setTelephone(owner.telephone || '');
      }).catch((err) => setErrorMessage(extractErrorMessage(err)));
    }
  }, [id]);

  const namePattern = /^[a-zA-Z]*$/;
  const phonePattern = /^[0-9]*$/;

  const errors: Record<string, string> = {};
  if (!firstName) errors.firstName = 'First name is required';
  else if (!namePattern.test(firstName)) errors.firstName = 'First name must consist of letters only';
  if (!lastName) errors.lastName = 'Last name is required';
  else if (!namePattern.test(lastName)) errors.lastName = 'Last name must consist of letters only';
  if (!address) errors.address = 'Address is required';
  if (!city) errors.city = 'City is required';
  if (!telephone) errors.telephone = 'Telephone is required';
  else if (!phonePattern.test(telephone)) errors.telephone = 'Telephone must consist of digits only';

  const isValid = Object.keys(errors).length === 0;

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, address: true, city: true, telephone: true });
    if (!isValid || !id) return;
    ownerService.updateOwner(Number(id), { id: Number(id), firstName, lastName, address, city, telephone })
      .then(() => navigate(`/owners/${id}`))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>Edit Owner</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={`form-group ${touched.firstName && errors.firstName ? 'has-error' : ''}`}>
          <label className="col-label">First Name</label>
          <input className="form-control" value={firstName} maxLength={30}
            onChange={(e) => setFirstName(e.target.value)} onBlur={() => handleBlur('firstName')} />
          {touched.firstName && errors.firstName && <span className="help-block">{errors.firstName}</span>}
        </div>
        <div className={`form-group ${touched.lastName && errors.lastName ? 'has-error' : ''}`}>
          <label className="col-label">Last Name</label>
          <input className="form-control" value={lastName} maxLength={30}
            onChange={(e) => setLastName(e.target.value)} onBlur={() => handleBlur('lastName')} />
          {touched.lastName && errors.lastName && <span className="help-block">{errors.lastName}</span>}
        </div>
        <div className={`form-group ${touched.address && errors.address ? 'has-error' : ''}`}>
          <label className="col-label">Address</label>
          <input className="form-control" value={address} maxLength={255}
            onChange={(e) => setAddress(e.target.value)} onBlur={() => handleBlur('address')} />
          {touched.address && errors.address && <span className="help-block">{errors.address}</span>}
        </div>
        <div className={`form-group ${touched.city && errors.city ? 'has-error' : ''}`}>
          <label className="col-label">City</label>
          <input className="form-control" value={city} maxLength={80}
            onChange={(e) => setCity(e.target.value)} onBlur={() => handleBlur('city')} />
          {touched.city && errors.city && <span className="help-block">{errors.city}</span>}
        </div>
        <div className={`form-group ${touched.telephone && errors.telephone ? 'has-error' : ''}`}>
          <label className="col-label">Telephone</label>
          <input className="form-control" value={telephone} maxLength={20}
            onChange={(e) => setTelephone(e.target.value)} onBlur={() => handleBlur('telephone')} />
          {touched.telephone && errors.telephone && <span className="help-block">{errors.telephone}</span>}
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate(`/owners/${id}`)}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>Update Owner</button>
        </div>
      </form>
    </div>
  );
}

export default OwnerEdit;
