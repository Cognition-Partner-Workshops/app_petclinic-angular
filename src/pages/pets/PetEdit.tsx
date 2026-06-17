import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { usePet, usePetMutations } from '../../hooks/usePets';
import { usePetTypes } from '../../hooks/usePetTypes';

interface PetFormData {
  name: string;
  birthDate: string;
  typeId: number;
}

export default function PetEdit() {
  const { ownerId, petId } = useParams<{ ownerId: string; petId: string }>();
  const navigate = useNavigate();
  const { data: pet, isLoading } = usePet(Number(petId));
  const { updateMutation } = usePetMutations();
  const { data: petTypes } = usePetTypes();
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<PetFormData>({ mode: 'onChange' });

  useEffect(() => {
    if (pet) {
      reset({
        name: pet.name,
        birthDate: pet.birthDate,
        typeId: pet.type?.id,
      });
    }
  }, [pet, reset]);

  if (isLoading) return <div>Loading...</div>;

  const onSubmit = (data: PetFormData) => {
    const selectedType = petTypes?.find((t) => t.id === Number(data.typeId));
    updateMutation.mutate(
      {
        id: Number(petId),
        pet: {
          id: Number(petId),
          name: data.name,
          birthDate: data.birthDate,
          type: selectedType || { id: Number(data.typeId), name: '' },
          ownerId: Number(ownerId),
        },
      },
      { onSuccess: () => navigate(`/owners/${ownerId}`) }
    );
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Pet</h2>
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
              <button className="btn btn-default" type="button" onClick={() => navigate(`/owners/${ownerId}`)}>Back</button>
              <button className="btn btn-default" type="submit" disabled={!isValid}>Update Pet</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
