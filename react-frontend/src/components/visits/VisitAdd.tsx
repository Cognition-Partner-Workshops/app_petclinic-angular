import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addVisit } from '../../services/api';

export default function VisitAdd() {
  const { ownerId, petId } = useParams<{ ownerId: string; petId: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!date.trim()) newErrors.date = 'Date is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    if (!ownerId || !petId) return;

    setIsSubmitting(true);
    addVisit(Number(ownerId), Number(petId), { date, description })
      .then(() => {
        navigate(`/owners/${ownerId}`);
      })
      .catch(() => {
        setApiError('Failed to add visit.');
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <h1>Add Visit</h1>
      {apiError && (
        <div role="alert">
          <p>{apiError}</p>
          <button onClick={() => setApiError(null)}>Dismiss</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-describedby={errors.date ? 'date-error' : undefined}
          />
          {errors.date && <span id="date-error">{errors.date}</span>}
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          {errors.description && <span id="description-error">{errors.description}</span>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          Save
        </button>
      </form>
    </div>
  );
}
