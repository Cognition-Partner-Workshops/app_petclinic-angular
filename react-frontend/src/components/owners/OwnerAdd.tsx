import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOwner } from '../../api/owners';

export default function OwnerAdd() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const namePattern = /^[a-zA-Z]*$/;
  const phonePattern = /^[0-9]*$/;

  const errors: Record<string, string> = {};
  if (!firstName) errors.firstName = 'First name is required';
  else if (firstName.length > 30) errors.firstName = 'First name may be at most 30 characters long';
  else if (!namePattern.test(firstName)) errors.firstName = 'First name must consist of letters only';

  if (!lastName) errors.lastName = 'Last name is required';
  else if (lastName.length > 30) errors.lastName = 'Last name may be at most 30 characters long';
  else if (!namePattern.test(lastName)) errors.lastName = 'Last name must consist of letters only';

  if (!address) errors.address = 'Address is required';
  else if (address.length > 255) errors.address = 'Address may be at most 255 characters long';

  if (!city) errors.city = 'City is required';
  else if (city.length > 80) errors.city = 'City may be at most 80 characters long';

  if (!telephone) errors.telephone = 'Telephone is required';
  else if (telephone.length > 20) errors.telephone = 'Telephone may be at most 20 characters long';
  else if (!phonePattern.test(telephone)) errors.telephone = 'Telephone must consist of digits only';

  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ firstName: true, lastName: true, address: true, city: true, telephone: true });
    if (!isValid) return;
    addOwner({ firstName, lastName, address, city, telephone })
      .then(() => navigate('/owners'))
      .catch((err) => setErrorMessage(String(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Owner</h2>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="form-horizontal">
          <div className={`form-group has-feedback ${touched.firstName ? (errors.firstName ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="firstName" className="col-sm-2 control-label">First Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => markTouched('firstName')}
                maxLength={30}
                required
              />
              {touched.firstName && errors.firstName && (
                <span className="help-block">{errors.firstName}</span>
              )}
            </div>
          </div>
          <div className={`form-group has-feedback ${touched.lastName ? (errors.lastName ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="lastName" className="col-sm-2 control-label">Last Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => markTouched('lastName')}
                maxLength={30}
                required
              />
              {touched.lastName && errors.lastName && (
                <span className="help-block">{errors.lastName}</span>
              )}
            </div>
          </div>
          <div className={`form-group has-feedback ${touched.address ? (errors.address ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="address" className="col-sm-2 control-label">Address</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => markTouched('address')}
                maxLength={255}
                required
              />
              {touched.address && errors.address && (
                <span className="help-block">{errors.address}</span>
              )}
            </div>
          </div>
          <div className={`form-group has-feedback ${touched.city ? (errors.city ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="city" className="col-sm-2 control-label">City</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={() => markTouched('city')}
                maxLength={80}
                required
              />
              {touched.city && errors.city && (
                <span className="help-block">{errors.city}</span>
              )}
            </div>
          </div>
          <div className={`form-group has-feedback ${touched.telephone ? (errors.telephone ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="telephone" className="col-sm-2 control-label">Telephone</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                onBlur={() => markTouched('telephone')}
                maxLength={20}
                required
              />
              {touched.telephone && errors.telephone && (
                <span className="help-block">{errors.telephone}</span>
              )}
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default" disabled={!isValid}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
