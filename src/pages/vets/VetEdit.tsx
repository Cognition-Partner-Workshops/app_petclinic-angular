import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useVet, useVetMutations } from '../../hooks/useVets';
import { useSpecialties } from '../../hooks/useSpecialties';

interface VetFormData {
  firstName: string;
  lastName: string;
  specialtyIds: string[];
}

export default function VetEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: vet, isLoading } = useVet(Number(id));
  const { updateMutation } = useVetMutations();
  const { data: allSpecialties } = useSpecialties();
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<VetFormData>({ mode: 'onChange' });

  useEffect(() => {
    if (vet) {
      reset({
        firstName: vet.firstName,
        lastName: vet.lastName,
        specialtyIds: vet.specialties?.map((s) => String(s.id)) || [],
      });
    }
  }, [vet, reset]);

  if (isLoading) return <div>Loading...</div>;

  const onSubmit = (data: VetFormData) => {
    const selectedSpecialties = (data.specialtyIds || [])
      .map((sid) => allSpecialties?.find((s) => s.id === Number(sid)))
      .filter(Boolean);
    updateMutation.mutate(
      {
        id: Number(id),
        vet: {
          id: Number(id),
          firstName: data.firstName,
          lastName: data.lastName,
          specialties: selectedSpecialties as { id: number; name: string }[],
        },
      },
      { onSuccess: () => navigate('/vets') }
    );
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Veterinarian</h2>
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
              <button className="btn btn-default" type="submit" disabled={!isValid}>Update Vet</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
