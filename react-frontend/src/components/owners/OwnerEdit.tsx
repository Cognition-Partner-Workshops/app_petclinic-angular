import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Owner } from '../../types';
import { getOwner, updateOwner } from '../../api/ownerService';

export default function OwnerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [telephone, setTelephone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);
    if (!id || isNaN(Number(id))) {
      setErrorMessage('Invalid owner ID.');
      setIsLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const data = await getOwner(Number(id));
        if (!cancelled) {
          setOwner(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setAddress(data.address);
          setCity(data.city);
          setTelephone(data.telephone);
        }
      } catch {
        if (!cancelled) setErrorMessage('Failed to load owner.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [id]);

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
    if (!owner) return;
    setErrorMessage(null);
    if (!validate()) return;
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
      .catch(() => {
        setErrorMessage('Failed to update owner.');
      });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Owner</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      {!owner && !errorMessage && <p>Owner not found.</p>}
      {owner && (
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
          <button type="submit">Update Owner</button>{' '}
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
