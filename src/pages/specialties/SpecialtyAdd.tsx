import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSpecialtyMutations } from '../../hooks/useSpecialties';

interface SpecialtyFormData {
  name: string;
}

export default function SpecialtyAdd() {
  const navigate = useNavigate();
  const { addMutation } = useSpecialtyMutations();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<SpecialtyFormData>({ mode: 'onChange' });

  const onSubmit = (data: SpecialtyFormData) => {
    addMutation.mutate(data, {
      onSuccess: () => navigate('/specialties'),
    });
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Specialty</h2>
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
              <button className="btn btn-default" type="submit" disabled={!isValid}>Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
