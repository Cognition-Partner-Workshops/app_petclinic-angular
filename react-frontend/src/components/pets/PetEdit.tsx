import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pet, PetType } from '../../types';
import { getPet, updatePet, deletePet } from '../../api/petService';
import { getPetTypes } from '../../api/petTypeService';

export default function PetEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [typeId, setTypeId] = useState<number>(0);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);
    if (!id || isNaN(Number(id))) {
      setErrorMessage('Invalid pet ID.');
      setIsLoading(false);
      return;
    }
    const load = async () => {
      try {
        const [petData, types] = await Promise.all([getPet(Number(id)), getPetTypes()]);
        if (!cancelled) {
          setPet(petData);
          setName(petData.name);
          setBirthDate(petData.birthDate);
          setTypeId(petData.type?.id ?? 0);
          setPetTypes(types);
        }
      } catch {
        if (!cancelled) setErrorMessage('Failed to load pet.');
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
    if (!name.trim()) errors.name = 'Name is required.';
    if (!birthDate) errors.birthDate = 'Birth date is required.';
    if (!typeId) errors.type = 'Type is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pet) return;
    setErrorMessage(null);
    if (!validate()) return;
    const selectedType = petTypes.find((t) => t.id === typeId);
    if (!selectedType) {
      setErrorMessage('Invalid pet type.');
      return;
    }
    const updated: Pet = {
      ...pet,
      name: name.trim(),
      birthDate,
      type: { id: selectedType.id, name: selectedType.name },
    };
    updatePet(pet.id, updated)
      .then(() => {
        navigate(pet.owner ? `/owners/${pet.owner.id}` : '/pets');
      })
      .catch(() => {
        setErrorMessage('Failed to update pet.');
      });
  };

  const handleDelete = () => {
    if (!pet) return;
    setErrorMessage(null);
    deletePet(pet.id)
      .then(() => {
        navigate(pet.owner ? `/owners/${pet.owner.id}` : '/pets');
      })
      .catch(() => {
        setErrorMessage('Failed to delete pet.');
      });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Pet</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      {!pet && !errorMessage && <p>Pet not found.</p>}
      {pet && (
        <form onSubmit={handleSubmit} noValidate>
          {pet.owner && (
            <p>
              Owner: {pet.owner.firstName} {pet.owner.lastName}
            </p>
          )}
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="petName">Name</label>
            <br />
            <input
              id="petName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-describedby={fieldErrors.name ? 'petName-error' : undefined}
            />
            {fieldErrors.name && (
              <span id="petName-error" style={{ color: 'red', marginLeft: 8 }}>
                {fieldErrors.name}
              </span>
            )}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="birthDate">Birth Date</label>
            <br />
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              aria-describedby={fieldErrors.birthDate ? 'birthDate-error' : undefined}
            />
            {fieldErrors.birthDate && (
              <span id="birthDate-error" style={{ color: 'red', marginLeft: 8 }}>
                {fieldErrors.birthDate}
              </span>
            )}
          </div>
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="petType">Type</label>
            <br />
            <select
              id="petType"
              value={typeId}
              onChange={(e) => setTypeId(Number(e.target.value))}
              aria-describedby={fieldErrors.type ? 'petType-error' : undefined}
            >
              <option value={0}>Select a type</option>
              {petTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            {fieldErrors.type && (
              <span id="petType-error" style={{ color: 'red', marginLeft: 8 }}>
                {fieldErrors.type}
              </span>
            )}
          </div>
          <button type="submit">Update Pet</button>{' '}
          <button type="button" onClick={handleDelete}>
            Delete Pet
          </button>{' '}
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
