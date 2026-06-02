import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Owner, PetType } from '../../types';
import { getOwnerById, getOwners } from '../../services/ownerService';
import { addPet } from '../../services/petService';
import { getPetTypes } from '../../services/petTypeService';

interface FormErrors {
  name?: string;
  birthDate?: string;
  type?: string;
  owner?: string;
}

export default function PetAdd() {
  const { id: ownerIdParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ownerName, setOwnerName] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState(ownerIdParam ?? '');
  const [allOwners, setAllOwners] = useState<Owner[]>([]);
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [form, setForm] = useState({ name: '', birthDate: '', typeId: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getPetTypes()
      .then((types) => setPetTypes(types))
      .catch((err: string) => setErrorMessage(err));

    if (ownerIdParam) {
      setSelectedOwnerId(ownerIdParam);
      getOwnerById(Number(ownerIdParam))
        .then((owner) => setOwnerName(`${owner.firstName} ${owner.lastName}`))
        .catch((err: string) => setErrorMessage(err));
    } else {
      getOwners()
        .then((owners) => setAllOwners(owners))
        .catch((err: string) => setErrorMessage(err));
    }
  }, [ownerIdParam]);

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
      case 'owner':
        if (!value) return 'Owner is required';
        return undefined;
      default:
        return undefined;
    }
  }

  function handleChange(field: string, value: string) {
    if (field === 'type') {
      setForm((prev) => ({ ...prev, typeId: value }));
    } else if (field === 'owner') {
      setSelectedOwnerId(value);
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let value: string;
    if (field === 'type') value = form.typeId;
    else if (field === 'owner') value = selectedOwnerId;
    else value = form[field as keyof typeof form];
    setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
  }

  function isFormValid(): boolean {
    const baseValid = !validateField('name', form.name)
      && !validateField('birthDate', form.birthDate)
      && !validateField('type', form.typeId);
    if (!ownerIdParam) {
      return baseValid && !validateField('owner', selectedOwnerId);
    }
    return baseValid;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newTouched: Record<string, boolean> = { name: true, birthDate: true, type: true };
    const newErrors: FormErrors = {
      name: validateField('name', form.name),
      birthDate: validateField('birthDate', form.birthDate),
      type: validateField('type', form.typeId),
    };
    if (!ownerIdParam) {
      newTouched.owner = true;
      newErrors.owner = validateField('owner', selectedOwnerId);
    }
    setTouched(newTouched);
    setErrors(newErrors);
    if (!isFormValid()) return;

    const selectedType = petTypes.find((t) => t.id === Number(form.typeId));
    if (!selectedType || !selectedOwnerId) return;

    addPet(Number(selectedOwnerId), {
      name: form.name,
      birthDate: form.birthDate,
      type: selectedType,
    })
      .then(() => navigate(`/owners/${selectedOwnerId}`))
      .catch((err: string) => setErrorMessage(err));
  }

  return (
    <div className="container xd-container">
      <h2>Add Pet</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form className="form-horizontal" onSubmit={handleSubmit}>
        {ownerIdParam ? (
          <div className="form-group">
            <label className="col-sm-2 control-label">Owner</label>
            <div className="col-sm-10">
              <input className="form-control" type="text" value={ownerName} readOnly />
            </div>
          </div>
        ) : (
          <div className={`form-group has-feedback ${touched.owner ? (errors.owner ? 'has-error' : 'has-success') : ''}`}>
            <label htmlFor="owner" className="col-sm-2 control-label">Owner</label>
            <div className="col-sm-10">
              <select
                id="owner"
                className="form-control"
                value={selectedOwnerId}
                onChange={(e) => handleChange('owner', e.target.value)}
                onBlur={() => handleBlur('owner')}
                required
              >
                <option value="">-- Select Owner --</option>
                {allOwners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.firstName} {owner.lastName}
                  </option>
                ))}
              </select>
              {touched.owner && errors.owner && <span className="help-block">{errors.owner}</span>}
            </div>
          </div>
        )}

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
            <button className="btn btn-default" type="button" onClick={() => navigate(ownerIdParam ? `/owners/${ownerIdParam}` : '/pets')}>
              &lt; Back
            </button>
            <button className="btn btn-default" type="submit" disabled={!isFormValid()}>
              Save Pet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
