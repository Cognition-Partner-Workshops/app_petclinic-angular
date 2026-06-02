import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOwner } from '../../api/ownerService';

export default function OwnerAdd() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    return () => {
      setErrorMessage(null);
    };
  }, []);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required.';
    if (!lastName.trim()) errors.lastName = 'Last name is required.';
    if (!address.trim()) errors.address = 'Address is required.';
    if (!city.trim()) errors.city = 'City is required.';
    if (!telephone.trim()) {
      errors.telephone = 'Telephone is required.';
    } else if (!/^\d+$/.test(telephone.trim())) {
      errors.telephone = 'Telephone must be numeric digits only.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validate()) return;
    addOwner({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      city: city.trim(),
      telephone: telephone.trim(),
    })
      .then((created) => {
        navigate(`/owners/${created.id}`);
      })
      .catch(() => {
        setErrorMessage('Failed to create owner.');
      });
  };

  return (
    <div>
      <h2>Add Owner</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="firstName">First Name</label>
          <br />
          <input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
          />
          {fieldErrors.firstName && (
            <span id="firstName-error" style={{ color: 'red', marginLeft: 8 }}>
              {fieldErrors.firstName}
            </span>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="lastName">Last Name</label>
          <br />
          <input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
          />
          {fieldErrors.lastName && (
            <span id="lastName-error" style={{ color: 'red', marginLeft: 8 }}>
              {fieldErrors.lastName}
            </span>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="address">Address</label>
          <br />
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            aria-describedby={fieldErrors.address ? 'address-error' : undefined}
          />
          {fieldErrors.address && (
            <span id="address-error" style={{ color: 'red', marginLeft: 8 }}>
              {fieldErrors.address}
            </span>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-describedby={fieldErrors.city ? 'city-error' : undefined}
          />
          {fieldErrors.city && (
            <span id="city-error" style={{ color: 'red', marginLeft: 8 }}>
              {fieldErrors.city}
            </span>
          )}
        </div>
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="telephone">Telephone</label>
          <br />
          <input
            id="telephone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            aria-describedby={fieldErrors.telephone ? 'telephone-error' : undefined}
          />
          {fieldErrors.telephone && (
            <span id="telephone-error" style={{ color: 'red', marginLeft: 8 }}>
              {fieldErrors.telephone}
            </span>
          )}
        </div>
        <button type="submit">Save Owner</button>{' '}
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </div>
  );
}
