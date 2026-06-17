import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { usePetTypeMutations } from '../../hooks/usePetTypes';

interface PetTypeFormData {
  name: string;
}

export default function PetTypeAdd() {
  const navigate = useNavigate();
  const { addMutation } = usePetTypeMutations();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<PetTypeFormData>({ mode: 'onChange' });

  const onSubmit = (data: PetTypeFormData) => {
    addMutation.mutate(data, {
      onSuccess: () => navigate('/pettypes'),
    });
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Pet Type</h2>
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
              <button className="btn btn-default" type="button" onClick={() => navigate('/pettypes')}>Back</button>
              <button className="btn btn-default" type="submit" disabled={!isValid}>Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
