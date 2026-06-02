import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Visit, Pet, Owner } from '../../types';
import { getVisit, updateVisit, deleteVisit } from '../../api/visitService';
import { getPet } from '../../api/petService';
import { getOwner } from '../../api/ownerService';

export default function VisitEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);
    if (!id || isNaN(Number(id))) {
      setErrorMessage('Invalid visit ID.');
      setIsLoading(false);
      return;
    }
    const load = async () => {
      try {
        const visitData = await getVisit(Number(id));
        if (cancelled) return;
        setVisit(visitData);
        setDate(visitData.date);
        setDescription(visitData.description);

        const petId = visitData.petId ?? visitData.pet?.id;
        if (petId) {
          try {
            const petData = await getPet(petId);
            if (cancelled) return;
            setPet(petData);
            if (petData.ownerId) {
              try {
                const ownerData = await getOwner(petData.ownerId);
                if (!cancelled) setOwner(ownerData);
              } catch {
                // Owner fetch is best-effort
              }
            }
          } catch {
            // Pet fetch is best-effort for display/navigation
          }
        }
      } catch {
        if (!cancelled) setErrorMessage('Failed to load visit.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const navigateBack = () => {
    if (owner) {
      navigate(`/owners/${owner.id}`);
    } else if (pet?.ownerId) {
      navigate(`/owners/${pet.ownerId}`);
    } else {
      navigate('/visits');
    }
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!date) errors.date = 'Date is required.';
    if (!description.trim()) errors.description = 'Description is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visit) return;
    setErrorMessage(null);
    if (!validate()) return;
    const updated: Visit = { ...visit, date, description: description.trim() };
    updateVisit(visit.id, updated)
      .then(() => {
        navigateBack();
      })
      .catch(() => {
        setErrorMessage('Failed to update visit.');
      });
  };

  const handleDelete = () => {
    if (!visit) return;
    setErrorMessage(null);
    deleteVisit(visit.id)
      .then(() => {
        navigateBack();
      })
      .catch(() => {
        setErrorMessage('Failed to delete visit.');
      });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Visit</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      {!visit && !errorMessage && <p>Visit not found.</p>}
      {visit && (
        <form onSubmit={handleSubmit} noValidate>
          {pet && (
            <p>
              Pet: {pet.name}
              {owner && ` (Owner: ${owner.firstName} ${owner.lastName})`}
            </p>
          )}
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="visitDate">Date</label>
            <br />
            <input
              id="visitDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              aria-describedby={fieldErrors.date ? 'visitDate-error' : undefined}
            />
            {fieldErrors.date && (
              <span id="visitDate-error" style={{ color: 'red', marginLeft: 8 }}>
                {fieldErrors.date}
              </span>
            )}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="visitDescription">Description</label>
            <br />
            <input
              id="visitDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-describedby={fieldErrors.description ? 'visitDescription-error' : undefined}
            />
            {fieldErrors.description && (
              <span id="visitDescription-error" style={{ color: 'red', marginLeft: 8 }}>
                {fieldErrors.description}
              </span>
            )}
          </div>
          <button type="submit">Update Visit</button>{' '}
          <button type="button" onClick={handleDelete}>
            Delete Visit
          </button>{' '}
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
