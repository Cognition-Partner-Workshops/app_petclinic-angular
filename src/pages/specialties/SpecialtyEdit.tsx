import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useSpecialty, useSpecialtyMutations } from '../../hooks/useSpecialties';

interface SpecialtyFormData {
  name: string;
}

export default function SpecialtyEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: specialty, isLoading } = useSpecialty(Number(id));
  const { updateMutation } = useSpecialtyMutations();
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<SpecialtyFormData>({ mode: 'onChange' });

  useEffect(() => {
    if (specialty) {
      reset({ name: specialty.name });
    }
  }, [specialty, reset]);

  if (isLoading) return <div>Loading...</div>;

  const onSubmit = (data: SpecialtyFormData) => {
    updateMutation.mutate(
      { id: Number(id), specialty: { ...data, id: Number(id) } },
      { onSuccess: () => navigate('/specialties') }
    );
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Specialty</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal">
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="name" className="col-sm-2 control-label">Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <span className="help-block">{errors.name.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-default" type="button" onClick={() => navigate('/specialties')}>Back</button>
              <button className="btn btn-default" type="submit" disabled={!isValid}>Update</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
