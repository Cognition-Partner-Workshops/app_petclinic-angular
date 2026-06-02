import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOwnerById, updateOwner } from '../../services/api';
import type { Owner } from '../../types';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  telephone?: string;
}

export default function OwnerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);

    if (!id) {
      setErrorMessage('Owner ID is required');
      setIsLoading(false);
      return;
    }

    const ownerId = Number(id);
    if (Number.isNaN(ownerId)) {
      setErrorMessage('Invalid owner ID');
      setIsLoading(false);
      return;
    }

    getOwnerById(ownerId)
      .then((data) => {
        if (!cancelled) {
          setOwner(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setAddress(data.address);
          setCity(data.city);
          setTelephone(data.telephone);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load owner';
          setErrorMessage(message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

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
    if (!owner) return;
    setErrorMessage(null);

    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const updated: Owner = {
      ...owner,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      city: city.trim(),
      telephone: telephone.trim(),
    };

    updateOwner(owner.id, updated)
      .then(() => {
        navigate(`/owners/${owner.id}`);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to update owner';
        setErrorMessage(message);
        setIsSubmitting(false);
      });
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (errorMessage && !owner) {
    return (
      <div>
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          {errorMessage}{' '}
          <button type="button" onClick={() => setErrorMessage(null)}>
            Dismiss
          </button>
        </div>
        <button type="button" onClick={() => navigate('/owners')}>
          Back to Owners
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Edit Owner</h2>

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
            {isSubmitting ? 'Saving...' : 'Update Owner'}
          </button>{' '}
          <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/owners'))}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
