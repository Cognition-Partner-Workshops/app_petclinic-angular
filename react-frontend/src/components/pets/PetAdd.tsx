import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPet, getOwnerById, getPetTypes } from '../../services/api';
import type { Owner, PetType } from '../../types';

interface FormErrors {
  name?: string;
  birthDate?: string;
  type?: string;
}

export default function PetAdd() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<number | ''>('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);

    if (!ownerId) {
      setErrorMessage('Owner ID is required');
      setIsLoading(false);
      return;
    }

    const ownerIdNum = Number(ownerId);
    if (Number.isNaN(ownerIdNum)) {
      setErrorMessage('Invalid owner ID');
      setIsLoading(false);
      return;
    }

    Promise.all([getOwnerById(ownerIdNum), getPetTypes()])
      .then(([ownerData, typesData]) => {
        if (!cancelled) {
          setOwner(ownerData);
          setPetTypes(typesData);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Failed to load data';
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
  }, [ownerId]);

  function validate(): FormErrors {
    const errors: FormErrors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!birthDate.trim()) errors.birthDate = 'Birth date is required';
    if (selectedTypeId === '') errors.type = 'Pet type is required';
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!owner) return;
    setErrorMessage(null);

    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const petType = petTypes.find((t) => t.id === selectedTypeId);
    if (!petType) return;

    setIsSubmitting(true);
    createPet(owner.id, {
      name: name.trim(),
      birthDate: birthDate.trim(),
      type: petType,
    })
      .then(() => {
        navigate(`/owners/${owner.id}`);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to add pet';
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
      <h2>Add Pet for {owner?.firstName} {owner?.lastName}</h2>

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
          <label htmlFor="petName">Name</label>
          <br />
          <input
            id="petName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-describedby={formErrors.name ? 'petName-error' : undefined}
          />
          {formErrors.name && (
            <div id="petName-error" style={{ color: 'red' }}>
              {formErrors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="birthDate">Birth Date</label>
          <br />
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            aria-describedby={formErrors.birthDate ? 'birthDate-error' : undefined}
          />
          {formErrors.birthDate && (
            <div id="birthDate-error" style={{ color: 'red' }}>
              {formErrors.birthDate}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="petType">Type</label>
          <br />
          <select
            id="petType"
            value={selectedTypeId}
            onChange={(e) =>
              setSelectedTypeId(e.target.value ? Number(e.target.value) : '')
            }
            aria-describedby={formErrors.type ? 'petType-error' : undefined}
          >
            <option value="">-- Select a type --</option>
            {petTypes.map((pt) => (
              <option key={pt.id} value={pt.id}>
                {pt.name}
              </option>
            ))}
          </select>
          {formErrors.type && (
            <div id="petType-error" style={{ color: 'red' }}>
              {formErrors.type}
            </div>
          )}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Pet'}
          </button>{' '}
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
