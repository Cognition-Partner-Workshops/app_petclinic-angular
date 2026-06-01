import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Owner } from '../../types';
import { getOwnerById, updateOwner } from '../../api/owners';

export default function OwnerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  useEffect(() => {
    if (!id) return;
    getOwnerById(Number(id))
      .then(setOwner)
      .catch((err) => setErrorMessage(String(err)));
  }, [id]);

  if (errorMessage) return <div className="alert alert-warning">{errorMessage}</div>;
  if (!owner) return <div>Loading...</div>;

  const namePattern = /^[a-zA-Z]*$/;
  const phonePattern = /^[0-9]*$/;

  const errors: Record<string, string> = {};
  if (!owner.firstName) errors.firstName = 'First name is required';
  else if (!namePattern.test(owner.firstName)) errors.firstName = 'First name must consist of letters only';

  if (!owner.lastName) errors.lastName = 'Last name is required';
  else if (!namePattern.test(owner.lastName)) errors.lastName = 'Last name must consist of letters only';

  if (!owner.address) errors.address = 'Address is required';
  if (!owner.city) errors.city = 'City is required';
  if (!owner.telephone) errors.telephone = 'Telephone is required';
  else if (!phonePattern.test(owner.telephone)) errors.telephone = 'Telephone must consist of digits only';

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, address: true, city: true, telephone: true });
    if (!isValid) return;
    updateOwner(Number(id), owner)
      .then(() => navigate(`/owners/${id}`))
      .catch((err) => setErrorMessage(String(err)));
  };

  const update = (field: keyof Owner, value: string) =>
    setOwner({ ...owner, [field]: value });

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Owner</h2>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="form-horizontal">
          <div className={`form-group has-feedback ${touched.firstName ? (errors.firstName ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="firstName" className="col-sm-2 control-label">First Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="firstName" value={owner.firstName || ''} onChange={(e) => update('firstName', e.target.value)} onBlur={() => markTouched('firstName')} required />
              {touched.firstName && errors.firstName && <span className="help-block">{errors.firstName}</span>}
            </div>
          </div>
          <div className={`form-group has-feedback ${touched.lastName ? (errors.lastName ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="lastName" className="col-sm-2 control-label">Last Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="lastName" value={owner.lastName || ''} onChange={(e) => update('lastName', e.target.value)} onBlur={() => markTouched('lastName')} required />
              {touched.lastName && errors.lastName && <span className="help-block">{errors.lastName}</span>}
            </div>
          </div>
          <div className={`form-group has-feedback ${touched.address ? (errors.address ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="address" className="col-sm-2 control-label">Address</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="address" value={owner.address || ''} onChange={(e) => update('address', e.target.value)} onBlur={() => markTouched('address')} required />
              {touched.address && errors.address && <span className="help-block">{errors.address}</span>}
            </div>
          </div>
          <div className={`form-group has-feedback ${touched.city ? (errors.city ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="city" className="col-sm-2 control-label">City</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="city" value={owner.city || ''} onChange={(e) => update('city', e.target.value)} onBlur={() => markTouched('city')} required />
              {touched.city && errors.city && <span className="help-block">{errors.city}</span>}
            </div>
          </div>
          <div className={`form-group has-feedback ${touched.telephone ? (errors.telephone ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="telephone" className="col-sm-2 control-label">Telephone</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="telephone" value={owner.telephone || ''} onChange={(e) => update('telephone', e.target.value)} onBlur={() => markTouched('telephone')} required />
              {touched.telephone && errors.telephone && <span className="help-block">{errors.telephone}</span>}
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default" disabled={!isValid}>Update Owner</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
