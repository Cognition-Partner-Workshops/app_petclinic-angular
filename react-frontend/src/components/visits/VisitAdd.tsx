import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Pet, Owner, PetType, Visit } from '../../types';
import { getPetById } from '../../services/petService';
import { getOwnerById } from '../../services/ownerService';
import { addVisit, deleteVisit } from '../../services/visitService';

interface FormErrors {
  date?: string;
  description?: string;
}

export default function VisitAdd() {
  const { id: petId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentPet, setCurrentPet] = useState<Pet>({} as Pet);
  const [currentOwner, setCurrentOwner] = useState<Owner>({} as Owner);
  const [currentPetType, setCurrentPetType] = useState<PetType>({} as PetType);
  const [form, setForm] = useState({ date: '', description: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    if (petId) {
      getPetById(Number(petId))
        .then((pet) => {
          setCurrentPet(pet);
          setCurrentPetType(pet.type);
          setVisits(pet.visits || []);
          if (pet.ownerId) {
            getOwnerById(pet.ownerId).then((owner) => setCurrentOwner(owner));
          }
        })
        .catch((err: string) => setErrorMessage(err));
    }
  }, [petId]);

  function validateField(field: string, value: string): string | undefined {
    switch (field) {
      case 'date':
        if (!value) return 'Date is required';
        return undefined;
      case 'description':
        if (!value) return 'Description is required';
        if (value.length > 255) return 'Description may be at most 255 characters long';
        return undefined;
      default:
        return undefined;
    }
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, form[field as keyof typeof form]) }));
  }

  function isFormValid(): boolean {
    return !validateField('date', form.date) && !validateField('description', form.description);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ date: true, description: true });
    setErrors({
      date: validateField('date', form.date),
      description: validateField('description', form.description),
    });
    if (!isFormValid() || !currentPet.id || !currentOwner.id) return;

    addVisit(currentOwner.id, currentPet.id, {
      date: form.date,
      description: form.description,
    })
      .then(() => navigate(`/owners/${currentOwner.id}`))
      .catch((err: string) => setErrorMessage(err));
  }

  function handleDeleteVisit(visitId: number) {
    if (confirm('Are you sure you want to delete this visit?')) {
      deleteVisit(visitId)
        .then(() => setVisits((prev) => prev.filter((v) => v.id !== visitId)))
        .catch((err: string) => setErrorMessage(err));
    }
  }

  return (
    <div className="container xd-container">
      <h2>New Visit</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

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
            <td>{currentPet.name}</td>
            <td>{currentPet.birthDate}</td>
            <td>{currentPetType.name}</td>
            <td>{currentOwner.firstName} {currentOwner.lastName}</td>
          </tr>
        </tbody>
      </table>

      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={`form-group has-feedback ${touched.date ? (errors.date ? 'has-error' : 'has-success') : ''}`}>
          <label className="col-sm-2 control-label">Date</label>
          <div className="col-sm-10">
            <input
              type="date"
              className="form-control"
              value={form.date}
              onChange={(e) => handleChange('date', e.target.value)}
              onBlur={() => handleBlur('date')}
              required
            />
            {touched.date && errors.date && <span className="help-block">{errors.date}</span>}
          </div>
        </div>

        <div className={`form-group has-feedback ${touched.description ? (errors.description ? 'has-error' : 'has-success') : ''}`}>
          <label htmlFor="description" className="col-sm-2 control-label">Description</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="description"
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              maxLength={255}
              required
            />
            {touched.description && errors.description && (
              <span className="help-block">{errors.description}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-default" type="button" onClick={() => navigate(`/owners/${currentOwner.id}`)}>
              Back
            </button>
            <button className="btn btn-default" type="submit" disabled={!isFormValid()}>
              Add Visit
            </button>
          </div>
        </div>
      </form>

      <br />
      <b>Previous Visits</b>
      <br />
      {visits.length > 0 && (
        <table className="table table-condensed">
          <thead>
            <tr>
              <th>Visit Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.date}</td>
                <td>{visit.description}</td>
                <td>
                  <button className="btn btn-default btn-sm" onClick={() => navigate(`/visits/${visit.id}/edit`)}>
                    Edit Visit
                  </button>
                  <button className="btn btn-default btn-sm" onClick={() => handleDeleteVisit(visit.id)}>
                    Delete Visit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
