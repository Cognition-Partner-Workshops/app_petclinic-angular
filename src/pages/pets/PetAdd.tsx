import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { usePetMutations } from '../../hooks/usePets';
import { usePetTypes } from '../../hooks/usePetTypes';

interface PetFormData {
  name: string;
  birthDate: string;
  typeId: number;
}

export default function PetAdd() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addMutation } = usePetMutations();
  const { data: petTypes } = usePetTypes();
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<PetFormData>({ mode: 'onChange' });

  const onSubmit = (data: PetFormData) => {
    const selectedType = petTypes?.find((t) => t.id === Number(data.typeId));
    addMutation.mutate(
      {
        ownerId: Number(id),
        pet: {
          name: data.name,
          birthDate: data.birthDate,
          type: selectedType || { id: Number(data.typeId), name: '' },
        },
      },
      { onSuccess: () => navigate(`/owners/${id}`) }
    );
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Pet</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal">
          <input type="hidden" value={id} />
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

          <div className={`form-group ${errors.birthDate ? 'has-error' : ''}`}>
            <label htmlFor="birthDate" className="col-sm-2 control-label">Birth Date</label>
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                id="birthDate"
                {...register('birthDate', { required: 'Birth date is required' })}
              />
              {errors.birthDate && <span className="help-block">{errors.birthDate.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="typeId" className="col-sm-2 control-label">Type</label>
            <div className="col-sm-10">
              <select className="form-control" id="typeId" {...register('typeId', { required: true })}>
                <option value="">Select a type</option>
                {petTypes?.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-default" type="button" onClick={() => navigate(`/owners/${id}`)}>Back</button>
              <button className="btn btn-default" type="submit" disabled={!isValid}>Save Pet</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
