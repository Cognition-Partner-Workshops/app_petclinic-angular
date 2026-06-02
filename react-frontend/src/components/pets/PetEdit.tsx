import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getOwnerById,
  getPetById,
  getPetTypes,
  updatePet,
} from '../../services/api';
import type { Owner, Pet, PetType } from '../../types';

interface FormErrors {
  name?: string;
  birthDate?: string;
  type?: string;
}

export default function PetEdit() {
  const { ownerId, petId } = useParams<{ ownerId: string; petId: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
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

    if (!ownerId || !petId) {
      setErrorMessage('Owner ID and Pet ID are required');
      setIsLoading(false);
      return;
    }

    const ownerIdNum = Number(ownerId);
    const petIdNum = Number(petId);
    if (Number.isNaN(ownerIdNum) || Number.isNaN(petIdNum)) {
      setErrorMessage('Invalid owner or pet ID');
      setIsLoading(false);
      return;
    }

    Promise.all([getPetById(petIdNum), getOwnerById(ownerIdNum), getPetTypes()])
      .then(([petData, ownerData, typesData]) => {
        if (!cancelled) {
          setPet(petData);
          setOwner(ownerData);
          setPetTypes(typesData);
          setName(petData.name);
          setBirthDate(petData.birthDate);
          setSelectedTypeId(petData.type?.id ?? '');
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
  }, [ownerId, petId]);

  function validate(): FormErrors {
    const errors: FormErrors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (!birthDate.trim()) errors.birthDate = 'Birth date is required';
    if (selectedTypeId === '') errors.type = 'Pet type is required';
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pet || !owner) return;
    setErrorMessage(null);

    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const petType = petTypes.find((t) => t.id === selectedTypeId);
    if (!petType) return;

    setIsSubmitting(true);
    const updated: Pet = {
      ...pet,
      name: name.trim(),
      birthDate: birthDate.trim(),
      type: petType,
      owner,
    };

    updatePet(pet.id, updated)
      .then(() => {
        navigate(`/owners/${owner.id}`);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to update pet';
        setErrorMessage(message);
        setIsSubmitting(false);
      });
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (errorMessage && !pet) {
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
      <h2>Edit Pet</h2>

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
            {isSubmitting ? 'Saving...' : 'Update Pet'}
          </button>{' '}
          <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(`/owners/${ownerId ?? ''}`))}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
