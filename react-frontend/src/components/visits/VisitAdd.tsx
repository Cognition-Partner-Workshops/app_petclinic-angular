import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createVisit, getOwnerById, getPetById } from '../../services/api';
import type { Owner, Pet } from '../../types';

interface FormErrors {
  date?: string;
  description?: string;
}

export default function VisitAdd() {
  const { ownerId, petId } = useParams<{ ownerId: string; petId: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
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

    Promise.all([getOwnerById(ownerIdNum), getPetById(petIdNum)])
      .then(([ownerData, petData]) => {
        if (!cancelled) {
          setOwner(ownerData);
          setPet(petData);
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
    if (!date.trim()) errors.date = 'Date is required';
    if (!description.trim()) errors.description = 'Description is required';
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!owner || !pet) return;
    setErrorMessage(null);

    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    createVisit(owner.id, pet.id, {
      date: date.trim(),
      description: description.trim(),
    })
      .then(() => {
        navigate(`/owners/${owner.id}`);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to add visit';
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
      <h2>Add Visit for {pet?.name}</h2>

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
          <label htmlFor="visitDate">Date</label>
          <br />
          <input
            id="visitDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-describedby={formErrors.date ? 'visitDate-error' : undefined}
          />
          {formErrors.date && (
            <div id="visitDate-error" style={{ color: 'red' }}>
              {formErrors.date}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label htmlFor="visitDescription">Description</label>
          <br />
          <input
            id="visitDescription"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-describedby={
              formErrors.description ? 'visitDescription-error' : undefined
            }
          />
          {formErrors.description && (
            <div id="visitDescription-error" style={{ color: 'red' }}>
              {formErrors.description}
            </div>
          )}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Visit'}
          </button>{' '}
          <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(`/owners/${ownerId ?? ''}`))}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
