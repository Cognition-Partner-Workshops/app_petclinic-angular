import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Pet, Owner, PetType } from '../../types';
import { getVisitById, updateVisit } from '../../api/visitApi';
import { getPetById } from '../../api/petApi';
import { getOwnerById } from '../../api/ownerApi';
import { extractErrorMessage } from '../../api/errorUtils';

interface FormErrors {
  date?: string;
  description?: string;
}

function validateVisit(values: { date: string; description: string }): FormErrors {
  const errors: FormErrors = {};
  if (!values.date) errors.date = 'Date is required';
  if (!values.description) errors.description = 'Description is required';
  return errors;
}

export default function VisitEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visitId, setVisitId] = useState<number>(0);
  const [currentPet, setCurrentPet] = useState<Pet | null>(null);
  const [currentOwner, setCurrentOwner] = useState<Owner | null>(null);
  const [currentPetType, setCurrentPetType] = useState<PetType | null>(null);
  const [form, setForm] = useState({ date: '', description: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (!id) return;
    getVisitById(Number(id)).then((visit) => {
      setVisitId(visit.id);
      setForm({
        date: visit.date || '',
        description: visit.description || '',
      });
      const petIdToFetch = visit.petId ?? visit.pet?.id;
      if (petIdToFetch) {
        getPetById(petIdToFetch).then((pet) => {
          setCurrentPet(pet);
          setCurrentPetType(pet.type);
          getOwnerById(pet.ownerId)
            .then((owner) => setCurrentOwner(owner))
            .catch((err) => setServerError(extractErrorMessage(err)));
        }).catch((err) => setServerError(extractErrorMessage(err)));
      }
    }).catch((err) => setServerError(extractErrorMessage(err)));
  }, [id]);

  const errors = validateVisit(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !currentPet) return;
    updateVisit(visitId, {
      id: visitId,
      date: form.date,
      description: form.description,
      pet: currentPet,
    })
      .then(() =>
        currentOwner
          ? navigate(`/owners/${currentOwner.id}`)
          : navigate('/owners')
      )
      .catch((err) => setServerError(extractErrorMessage(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Visit</h2>

        {serverError && <div className="alert alert-danger">{serverError}</div>}

        <b>Pet</b>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Type</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{currentPet?.name}</td>
              <td>{currentPet?.birthDate}</td>
              <td>{currentPetType?.name}</td>
              <td>
                {currentOwner
                  ? `${currentOwner.firstName} ${currentOwner.lastName}`
                  : ''}
              </td>
            </tr>
          </tbody>
        </table>

        <form className="form-horizontal" onSubmit={handleSubmit}>
          <div
            className={`form-group has-feedback ${
              touched.date ? (errors.date ? 'has-error' : 'has-success') : ''
            }`}
          >
            <label className="col-sm-2 control-label">Date</label>
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, date: true }))}
              />
              {touched.date && errors.date && (
                <span className="help-block">{errors.date}</span>
              )}
            </div>
          </div>

          <div
            className={`form-group has-feedback ${
              touched.description
                ? errors.description
                  ? 'has-error'
                  : 'has-success'
                : ''
            }`}
          >
            <label className="col-sm-2 control-label">Description</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                maxLength={255}
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, description: true }))
                }
              />
              {touched.description && errors.description && (
                <span className="help-block">{errors.description}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                className="btn btn-default"
                type="button"
                onClick={() =>
                  currentOwner
                    ? navigate(`/owners/${currentOwner.id}`)
                    : navigate('/owners')
                }
              >
                Back
              </button>
              <button
                className="btn btn-default"
                type="submit"
                disabled={!isValid || !currentPet}
              >
                Update Visit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
