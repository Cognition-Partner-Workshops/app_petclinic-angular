import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOwner } from '../../services/api';

export default function OwnerAdd() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!telephone.trim()) newErrors.telephone = 'Telephone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    addOwner({ firstName, lastName, address, city, telephone })
      .then((created) => {
        navigate(`/owners/${created.id}`);
      })
      .catch(() => {
        setApiError('Failed to create owner.');
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <h1>Add Owner</h1>
      {apiError && (
        <div role="alert">
          <p>{apiError}</p>
          <button onClick={() => setApiError(null)}>Dismiss</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
          />
          {errors.firstName && <span id="firstName-error">{errors.firstName}</span>}
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
          />
          {errors.lastName && <span id="lastName-error">{errors.lastName}</span>}
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {errors.address && <span id="address-error">{errors.address}</span>}
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city && <span id="city-error">{errors.city}</span>}
        </div>
        <div>
          <label htmlFor="telephone">Telephone</label>
          <input
            id="telephone"
            type="text"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            aria-describedby={errors.telephone ? 'telephone-error' : undefined}
          />
          {errors.telephone && <span id="telephone-error">{errors.telephone}</span>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          Save
        </button>
      </form>
    </div>
  );
}
