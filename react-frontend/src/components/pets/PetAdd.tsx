import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PetType, Owner } from '../../types';
import { addPet } from '../../api/petService';
import { getPetTypes } from '../../api/petTypeService';
import { getOwner, getOwners } from '../../api/ownerService';

export default function PetAdd() {
  const { id: ownerIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [typeId, setTypeId] = useState<number>(0);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const hasOwnerParam = !!ownerIdParam;

  useEffect(() => {
    let cancelled = false;
    setErrorMessage(null);

    const load = async () => {
      try {
        const types = await getPetTypes();
        if (cancelled) return;
        setPetTypes(types);
        if (types.length > 0) setTypeId(types[0].id);

        if (hasOwnerParam) {
          const ownerId = Number(ownerIdParam);
          if (isNaN(ownerId)) {
            setErrorMessage('Invalid owner ID.');
            setIsLoading(false);
            return;
          }
          try {
            const owner = await getOwner(ownerId);
            if (!cancelled) {
              setSelectedOwnerId(owner.id);
              setOwners([owner]);
            }
          } catch {
            if (!cancelled) setErrorMessage('Failed to load owner.');
          }
        } else {
          try {
            const allOwners = await getOwners();
            if (!cancelled) {
              setOwners(allOwners);
              if (allOwners.length > 0) setSelectedOwnerId(allOwners[0].id);
            }
          } catch {
            if (!cancelled) setErrorMessage('Failed to load owners.');
          }
        }
      } catch {
        if (!cancelled) setErrorMessage('Failed to load pet types.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [ownerIdParam, hasOwnerParam]);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Name is required.';
    if (!birthDate) errors.birthDate = 'Birth date is required.';
    if (!typeId) errors.type = 'Type is required.';
    if (!selectedOwnerId) errors.owner = 'Owner is required.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!validate()) return;
    const selectedType = petTypes.find((t) => t.id === typeId);
    if (!selectedType) {
      setErrorMessage('Invalid pet type.');
      return;
    }
    addPet(selectedOwnerId, {
      name: name.trim(),
      birthDate,
      type: { id: selectedType.id, name: selectedType.name },
    })
      .then(() => {
        navigate(`/owners/${selectedOwnerId}`);
      })
      .catch(() => {
        setErrorMessage('Failed to create pet.');
      });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Add Pet</h2>
      {errorMessage && (
        <div role="alert" style={{ color: 'red', marginBottom: 8 }}>
          {errorMessage}
          <button onClick={() => setErrorMessage(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate>
        {!hasOwnerParam && (
          <div style={{ marginBottom: 8 }}>
            <label htmlFor="owner">Owner</label>
            <br />
            <select
              id="owner"
              value={selectedOwnerId}
              onChange={(e) => setSelectedOwnerId(Number(e.target.value))}
              aria-describedby={fieldErrors.owner ? 'owner-error' : undefined}
            >
              <option value={0}>Select an owner</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.firstName} {o.lastName}
                </option>
              ))}
            </select>
            {fieldErrors.owner && (
              <span id="owner-error" style={{ color: 'red', marginLeft: 8 }}>
                {fieldErrors.owner}
              </span>
            )}
          </div>
        )}
        {hasOwnerParam && owners.length > 0 && (
          <p>
            Owner: {owners[0].firstName} {owners[0].lastName}
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
        <button type="submit">Save Pet</button>{' '}
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </form>
    </div>
  );
}
