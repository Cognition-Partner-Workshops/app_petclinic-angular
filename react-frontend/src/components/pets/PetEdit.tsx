import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PetType } from '../../types';
import { getOwnerById } from '../../services/ownerService';
import { getPetById, updatePet } from '../../services/petService';
import { getPetTypes } from '../../services/petTypeService';

interface FormErrors {
  name?: string;
  birthDate?: string;
  type?: string;
}

export default function PetEdit() {
  const { id: petId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState('');
  const [ownerId, setOwnerId] = useState<number | null>(null);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [form, setForm] = useState({ name: '', birthDate: '', typeId: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getPetTypes()
      .then((types) => setPetTypes(types))
      .catch((err: string) => setErrorMessage(err));

    if (petId) {
      getPetById(Number(petId))
        .then((pet) => {
          setForm({
            name: pet.name,
            birthDate: pet.birthDate,
            typeId: pet.type?.id?.toString() ?? '',
          });
          if (pet.ownerId) {
            setOwnerId(pet.ownerId);
            getOwnerById(pet.ownerId)
              .then((owner) => setOwnerName(`${owner.firstName} ${owner.lastName}`))
              .catch((err: string) => setErrorMessage(err));
          }
        })
        .catch((err: string) => setErrorMessage(err));
    }
  }, [petId]);

  function validateField(field: string, value: string): string | undefined {
    switch (field) {
      case 'name':
        if (!value) return 'Name is required';
        if (value.length > 30) return 'Name may be at most 30 characters long';
        if (!/^[A-Za-z0-9]/.test(value)) return 'Name must begin with a letter or digit';
        return undefined;
      case 'birthDate':
        if (!value) return 'Birth date is required';
        return undefined;
      case 'type':
        if (!value) return 'Pet type is required';
        return undefined;
      default:
        return undefined;
    }
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field === 'type' ? 'typeId' : field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const value = field === 'type' ? form.typeId : form[field as keyof typeof form];
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  }

  function isFormValid(): boolean {
    return !validateField('name', form.name)
      && !validateField('birthDate', form.birthDate)
      && !validateField('type', form.typeId);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ name: true, birthDate: true, type: true });
    setErrors({
      name: validateField('name', form.name),
      birthDate: validateField('birthDate', form.birthDate),
      type: validateField('type', form.typeId),
    });
    if (!isFormValid() || !petId || ownerId === null) return;

    const selectedType = petTypes.find((t) => t.id === Number(form.typeId));
    if (!selectedType) return;

    updatePet(Number(petId), {
      id: Number(petId),
      name: form.name,
      birthDate: form.birthDate,
      type: selectedType,
      ownerId,
    } as Parameters<typeof updatePet>[1])
      .then(() => navigate(`/owners/${ownerId}`))
      .catch((err: string) => setErrorMessage(err));
  }

  return (
    <div className="container xd-container">
      <h2>Edit Pet</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="col-sm-2 control-label">Owner</label>
          <div className="col-sm-10">
            <input className="form-control" type="text" value={ownerName} readOnly />
          </div>
        </div>

        <div className={`form-group has-feedback ${touched.name ? (errors.name ? 'has-error' : 'has-success') : ''}`}>
          <label htmlFor="name" className="col-sm-2 control-label">Name</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              maxLength={30}
              required
            />
            {touched.name && errors.name && <span className="help-block">{errors.name}</span>}
          </div>
        </div>

        <div className={`form-group has-feedback ${touched.birthDate ? (errors.birthDate ? 'has-error' : 'has-success') : ''}`}>
          <label htmlFor="birthDate" className="col-sm-2 control-label">Birth Date</label>
          <div className="col-sm-10">
            <input
              type="date"
              className="form-control"
              id="birthDate"
              value={form.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              onBlur={() => handleBlur('birthDate')}
              required
            />
            {touched.birthDate && errors.birthDate && <span className="help-block">{errors.birthDate}</span>}
          </div>
        </div>

        <div className={`form-group has-feedback ${touched.type ? (errors.type ? 'has-error' : 'has-success') : ''}`}>
          <label htmlFor="type" className="col-sm-2 control-label">Type</label>
          <div className="col-sm-10">
            <select
              id="type"
              className="form-control"
              value={form.typeId}
              onChange={(e) => handleChange('type', e.target.value)}
              onBlur={() => handleBlur('type')}
              required
            >
              <option value="">-- Select --</option>
              {petTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {touched.type && errors.type && <span className="help-block">{errors.type}</span>}
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-default" type="button" onClick={() => navigate(ownerId ? `/owners/${ownerId}` : '/pets')}>
              &lt; Back
            </button>
            <button className="btn btn-default" type="submit" disabled={!isFormValid()}>
              Update Pet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
