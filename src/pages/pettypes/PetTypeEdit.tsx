import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { usePetType, usePetTypeMutations } from '../../hooks/usePetTypes';

interface PetTypeFormData {
  name: string;
}

export default function PetTypeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: petType, isLoading } = usePetType(Number(id));
  const { updateMutation } = usePetTypeMutations();
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<PetTypeFormData>({ mode: 'onChange' });

  useEffect(() => {
    if (petType) {
      reset({ name: petType.name });
    }
  }, [petType, reset]);

  if (isLoading) return <div>Loading...</div>;

  const onSubmit = (data: PetTypeFormData) => {
    updateMutation.mutate(
      { id: Number(id), petType: { ...data, id: Number(id) } },
      { onSuccess: () => navigate('/pettypes') }
    );
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Pet Type</h2>
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
              <button className="btn btn-default" type="submit" disabled={!isValid}>Update</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
