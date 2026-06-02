import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getOwnerById,
  getPetById,
  getVisitById,
  updateVisit,
} from '../../services/api';
import type { Owner, Pet, Visit } from '../../types';

interface FormErrors {
  date?: string;
  description?: string;
}

export default function VisitEdit() {
  const { ownerId, petId, visitId } = useParams<{
    ownerId: string;
    petId: string;
    visitId: string;
  }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
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

    if (!ownerId || !petId || !visitId) {
      setErrorMessage('Owner ID, Pet ID, and Visit ID are required');
      setIsLoading(false);
      return;
    }

    const ownerIdNum = Number(ownerId);
    const petIdNum = Number(petId);
    const visitIdNum = Number(visitId);
    if (
      Number.isNaN(ownerIdNum) ||
      Number.isNaN(petIdNum) ||
      Number.isNaN(visitIdNum)
    ) {
      setErrorMessage('Invalid ID parameters');
      setIsLoading(false);
      return;
    }

    Promise.all([
      getVisitById(visitIdNum),
      getOwnerById(ownerIdNum),
      getPetById(petIdNum),
    ])
      .then(([visitData, ownerData, petData]) => {
        if (!cancelled) {
          setVisit(visitData);
          setOwner(ownerData);
          setPet(petData);
          setDate(visitData.date);
          setDescription(visitData.description);
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
  }, [ownerId, petId, visitId]);

  function validate(): FormErrors {
    const errors: FormErrors = {};
    if (!date.trim()) errors.date = 'Date is required';
    if (!description.trim()) errors.description = 'Description is required';
    return errors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!visit || !owner || !pet) return;
    setErrorMessage(null);

    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    const updated: Visit = {
      ...visit,
      date: date.trim(),
      description: description.trim(),
      pet,
    };

    updateVisit(visit.id, updated)
      .then(() => {
        navigate(`/owners/${owner.id}`);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Failed to update visit';
        setErrorMessage(message);
        setIsSubmitting(false);
      });
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (errorMessage && !visit) {
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
      <h2>Edit Visit</h2>

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
            {isSubmitting ? 'Saving...' : 'Update Visit'}
          </button>{' '}
          <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(`/owners/${ownerId ?? ''}`))}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
