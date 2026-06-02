import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addPet, getPetTypes } from '../../services/api';

interface PetTypeOption {
  id: number;
  name: string;
}

export default function PetAdd() {
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [typeId, setTypeId] = useState('');
  const [petTypes, setPetTypes] = useState<PetTypeOption[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPetTypes()
      .then((types) => {
        setPetTypes(types);
        setIsLoading(false);
      })
      .catch(() => {
        setPetTypes([
          { id: 1, name: 'cat' },
          { id: 2, name: 'dog' },
          { id: 3, name: 'lizard' },
          { id: 4, name: 'snake' },
          { id: 5, name: 'bird' },
          { id: 6, name: 'hamster' },
        ]);
        setIsLoading(false);
      });
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!birthDate.trim()) newErrors.birthDate = 'Birth date is required';
    if (!typeId) newErrors.type = 'Type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    if (!ownerId) return;

    const selectedType = petTypes.find((t) => t.id === Number(typeId));
    if (!selectedType) return;

    setIsSubmitting(true);
    addPet(Number(ownerId), { name, birthDate, type: selectedType })
      .then(() => {
        navigate(`/owners/${ownerId}`);
      })
      .catch(() => {
        setApiError('Failed to add pet.');
        setIsSubmitting(false);
      });
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Add Pet</h1>
      {apiError && (
        <div role="alert">
          <p>{apiError}</p>
          <button onClick={() => setApiError(null)}>Dismiss</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name && <span id="name-error">{errors.name}</span>}
        </div>
        <div>
          <label htmlFor="birthDate">Birth Date</label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            aria-describedby={errors.birthDate ? 'birthDate-error' : undefined}
          />
          {errors.birthDate && <span id="birthDate-error">{errors.birthDate}</span>}
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
            aria-describedby={errors.type ? 'type-error' : undefined}
          >
            <option value="">-- Select Type --</option>
            {petTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          {errors.type && <span id="type-error">{errors.type}</span>}
        </div>
        <button type="submit" disabled={isSubmitting}>
          Save
        </button>
      </form>
    </div>
  );
}
