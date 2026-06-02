import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet } from '../../types';
import { getPet, getPets } from '../../api/petService';
import { addVisit } from '../../api/visitService';

export default function VisitAdd() {
  const { id: petIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const hasPetParam = !!petIdParam;

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);

    const load = async () => {
      try {
        if (hasPetParam) {
          const petId = Number(petIdParam);
          if (isNaN(petId)) {
            setErrorMessage('Invalid pet ID.');
            setIsLoading(false);
            return;
          }
          const pet = await getPet(petId);
          if (!cancelled) {
            setPets([pet]);
            setSelectedPetId(pet.id);
          }
        } else {
          const allPets = await getPets();
          if (!cancelled) {
            setPets(allPets);
            if (allPets.length > 0) setSelectedPetId(allPets[0].id);
          }
        }
      } catch {
        if (!cancelled) setErrorMessage('Failed to load pet data.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [petIdParam, hasPetParam]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!date) errors.date = 'Date is required.';
    if (!description.trim()) errors.description = 'Description is required.';
    if (!selectedPetId) errors.pet = 'Pet is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validate()) return;
    const pet = pets.find((p) => p.id === selectedPetId);
    if (!pet) {
      setErrorMessage('Selected pet not found.');
      return;
    }
    const ownerId = pet.ownerId ?? pet.owner?.id;
    if (!ownerId) {
      setErrorMessage('Could not determine owner for this pet.');
      return;
    }
    addVisit(ownerId, selectedPetId, { date, description: description.trim() })
      .then(() => {
        navigate(`/owners/${ownerId}`);
      })
      .catch(() => {
        setErrorMessage('Failed to create visit.');
      });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Add Visit</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        {!hasPetParam && (
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="pet">Pet</label>
            <br />
            <select
              id="pet"
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(Number(e.target.value))}
              aria-describedby={fieldErrors.pet ? 'pet-error' : undefined}
            >
              <option value={0}>Select a pet</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.owner ? `(${p.owner.firstName} ${p.owner.lastName})` : ''}
                </option>
              ))}
            </select>
            {fieldErrors.pet && (
              <span id="pet-error" style={{ color: 'red', marginLeft: 8 }}>
                {fieldErrors.pet}
              </span>
            )}
          </div>
        )}
        {hasPetParam && pets.length > 0 && (
          <p>
            Pet: {pets[0].name}
            {pets[0].owner && ` (Owner: ${pets[0].owner.firstName} ${pets[0].owner.lastName})`}
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
        <button type="submit">Save Visit</button>{' '}
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </div>
  );
}
