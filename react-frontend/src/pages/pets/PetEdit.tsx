import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { PetType } from '../../types';
import { getPetById, updatePet } from '../../api/petApi';
import { getOwnerById } from '../../api/ownerApi';
import { getPetTypes } from '../../api/petTypeApi';
import { extractErrorMessage } from '../../api/errorUtils';

interface FormErrors {
  name?: string;
  birthDate?: string;
  type?: string;
}

function validatePet(values: { name: string; birthDate: string; typeId: string }): FormErrors {
  const errors: FormErrors = {};
  if (!values.name) errors.name = 'Name is required';
  else if (!/^[A-Za-z0-9]/.test(values.name)) errors.name = 'Name must begin with a letter or digit';
  if (!values.birthDate) errors.birthDate = 'BirthDate is required';
  if (!values.typeId) errors.type = 'Pet type is required';
  return errors;
}

export default function PetEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [petId, setPetId] = useState<number>(0);
  const [ownerId, setOwnerId] = useState<number>(0);
  const [ownerName, setOwnerName] = useState('');
  const [currentTypeName, setCurrentTypeName] = useState('');
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [form, setForm] = useState({ name: '', birthDate: '', typeId: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!id) return;
    const numId = Number(id);
    getPetTypes()
      .then((types) => setPetTypes(types))
      .catch((err) => setServerError(extractErrorMessage(err)));

    getPetById(numId).then((pet) => {
      setPetId(pet.id);
      setOwnerId(pet.ownerId);
      setCurrentTypeName(pet.type?.name || '');
      setForm({
        name: pet.name || '',
        birthDate: pet.birthDate || '',
        typeId: pet.type?.id?.toString() || '',
      });
      getOwnerById(pet.ownerId)
        .then((o) => setOwnerName(`${o.firstName} ${o.lastName}`))
        .catch((err) => setServerError(extractErrorMessage(err)));
    }).catch((err) => setServerError(extractErrorMessage(err)));
  }, [id]);

  const errors = validatePet(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'typeId') {
      const found = petTypes.find((t) => t.id === Number(value));
      if (found) setCurrentTypeName(found.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    const selectedType = petTypes.find((t) => t.id === Number(form.typeId));
    updatePet(petId, {
      id: petId,
      name: form.name,
      birthDate: form.birthDate,
      type: selectedType,
      ownerId,
    })
      .then(() => navigate(`/owners/${ownerId}`))
      .catch((err) => setServerError(extractErrorMessage(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Pet</h2>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <form className="form-horizontal" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="col-sm-2 control-label">Owner</label>
            <div className="col-sm-10">
              <input className="form-control" type="text" value={ownerName} readOnly />
            </div>
          </div>

          <div
            className={`form-group has-feedback ${
              touched.name ? (errors.name ? 'has-error' : 'has-success') : ''
            }`}
          >
            <label className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                value={form.name}
                maxLength={30}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              />
              {touched.name && errors.name && (
                <span className="help-block">{errors.name}</span>
              )}
            </div>
          </div>

          <div
            className={`form-group has-feedback ${
              touched.birthDate
                ? errors.birthDate
                  ? 'has-error'
                  : 'has-success'
                : ''
            }`}
          >
            <label className="col-sm-2 control-label">Birth Date</label>
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                value={form.birthDate}
                onChange={(e) => handleChange('birthDate', e.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, birthDate: true }))
                }
              />
              {touched.birthDate && errors.birthDate && (
                <span className="help-block">{errors.birthDate}</span>
              )}
            </div>
          </div>

          <div
            className={`form-group has-feedback ${
              touched.typeId ? (errors.type ? 'has-error' : 'has-success') : ''
            }`}
          >
            <label className="col-sm-2 control-label">Type</label>
            <div className="col-sm-10">
              <div className="col-sm-2" style={{ paddingLeft: 0 }}>
                <input
                  className="form-control"
                  type="text"
                  value={currentTypeName}
                  readOnly
                />
              </div>
              <div className="col-sm-8">
                <select
                  className="form-control"
                  value={form.typeId}
                  onChange={(e) => handleChange('typeId', e.target.value)}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, typeId: true }))
                  }
                >
                  <option value="">-- Select --</option>
                  {petTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {touched.typeId && errors.type && (
                  <span className="help-block">{errors.type}</span>
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                className="btn btn-default"
                type="button"
                onClick={() => navigate(`/owners/${ownerId}`)}
              >
                &lt; Back
              </button>
              <button
                className="btn btn-default"
                type="submit"
                disabled={!isValid}
              >
                Update Pet
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
