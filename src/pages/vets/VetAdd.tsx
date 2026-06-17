import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useVetMutations } from '../../hooks/useVets';
import { useSpecialties } from '../../hooks/useSpecialties';

interface VetFormData {
  firstName: string;
  lastName: string;
  specialtyIds: string[];
}

export default function VetAdd() {
  const navigate = useNavigate();
  const { addMutation } = useVetMutations();
  const { data: allSpecialties } = useSpecialties();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<VetFormData>({ mode: 'onChange' });

  const onSubmit = (data: VetFormData) => {
    const selectedSpecialties = (data.specialtyIds || [])
      .map((id) => allSpecialties?.find((s) => s.id === Number(id)))
      .filter(Boolean);
    addMutation.mutate(
      {
        firstName: data.firstName,
        lastName: data.lastName,
        specialties: selectedSpecialties as { id: number; name: string }[],
      },
      { onSuccess: () => navigate('/vets') }
    );
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Veterinarian</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal">
          <div className={`form-group ${errors.firstName ? 'has-error' : ''}`}>
            <label htmlFor="firstName" className="col-sm-2 control-label">First Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="firstName"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && <span className="help-block">{errors.firstName.message}</span>}
            </div>
          </div>

          <div className={`form-group ${errors.lastName ? 'has-error' : ''}`}>
            <label htmlFor="lastName" className="col-sm-2 control-label">Last Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="lastName"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && <span className="help-block">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="specialtyIds" className="col-sm-2 control-label">Specialties</label>
            <div className="col-sm-10">
              <select multiple className="form-control" id="specialtyIds" {...register('specialtyIds')}>
                {allSpecialties?.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-default" type="button" onClick={() => navigate('/vets')}>Back</button>
              <button className="btn btn-default" type="submit" disabled={!isValid}>Save Vet</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
