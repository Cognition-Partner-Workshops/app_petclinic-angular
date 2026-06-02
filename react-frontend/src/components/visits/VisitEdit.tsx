import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Visit } from '../../types';
import { getVisit, updateVisit, deleteVisit } from '../../api/visitService';

export default function VisitEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
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
        const data = await getVisit(Number(id));
        if (!cancelled) {
          setVisit(data);
          setDate(data.date);
          setDescription(data.description);
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
        const ownerId = visit.pet?.owner?.id ?? visit.pet?.ownerId;
        navigate(ownerId ? `/owners/${ownerId}` : '/visits');
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
        const ownerId = visit.pet?.owner?.id ?? visit.pet?.ownerId;
        navigate(ownerId ? `/owners/${ownerId}` : '/visits');
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
          {visit.pet && (
            <p>
              Pet: {visit.pet.name}
              {visit.pet.owner &&
                ` (Owner: ${visit.pet.owner.firstName} ${visit.pet.owner.lastName})`}
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
