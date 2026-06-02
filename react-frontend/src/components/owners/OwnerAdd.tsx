import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOwner } from '../../services/api';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  telephone?: string;
}

export default function OwnerAdd() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): FormErrors {
    const errors: FormErrors = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!address.trim()) errors.address = 'Address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!telephone.trim()) errors.telephone = 'Telephone is required';
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    createOwner({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      city: city.trim(),
      telephone: telephone.trim(),
    })
      .then((created) => {
        navigate(`/owners/${created.id}`);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to create owner';
        setErrorMessage(message);
        setIsSubmitting(false);
      });
  }

  return (
    <div>
      <h2>Add Owner</h2>

      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          {errorMessage}{' '}
          <button type="button" onClick={() => setErrorMessage(null)}>
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="firstName">First Name</label>
          <br />
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-describedby={formErrors.firstName ? 'firstName-error' : undefined}
          />
          {formErrors.firstName && (
            <div id="firstName-error" style={{ color: 'red' }}>
              {formErrors.firstName}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="lastName">Last Name</label>
          <br />
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            aria-describedby={formErrors.lastName ? 'lastName-error' : undefined}
          />
          {formErrors.lastName && (
            <div id="lastName-error" style={{ color: 'red' }}>
              {formErrors.lastName}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="address">Address</label>
          <br />
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            aria-describedby={formErrors.address ? 'address-error' : undefined}
          />
          {formErrors.address && (
            <div id="address-error" style={{ color: 'red' }}>
              {formErrors.address}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-describedby={formErrors.city ? 'city-error' : undefined}
          />
          {formErrors.city && (
            <div id="city-error" style={{ color: 'red' }}>
              {formErrors.city}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="telephone">Telephone</label>
          <br />
          <input
            id="telephone"
            type="text"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            aria-describedby={formErrors.telephone ? 'telephone-error' : undefined}
          />
          {formErrors.telephone && (
            <div id="telephone-error" style={{ color: 'red' }}>
              {formErrors.telephone}
            </div>
          )}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Owner'}
          </button>{' '}
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
