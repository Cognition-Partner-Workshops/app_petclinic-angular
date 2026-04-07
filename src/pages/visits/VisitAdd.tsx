import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useVisitMutations } from '../../hooks/useVisits';
import { usePet } from '../../hooks/usePets';

interface VisitFormData {
  date: string;
  description: string;
}

export default function VisitAdd() {
  const { ownerId, petId } = useParams<{ ownerId: string; petId: string }>();
  const navigate = useNavigate();
  const { addMutation } = useVisitMutations();
  const { data: pet } = usePet(Number(petId));
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<VisitFormData>({ mode: 'onChange' });

  const onSubmit = (data: VisitFormData) => {
    addMutation.mutate(
      {
        ownerId: Number(ownerId),
        petId: Number(petId),
        visit: data,
      },
      { onSuccess: () => navigate(`/owners/${ownerId}`) }
    );
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Visit</h2>
        {pet && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Birth Date</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{pet.name}</td>
                <td>{pet.birthDate}</td>
                <td>{pet.type?.name}</td>
              </tr>
            </tbody>
          </table>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal">
          <div className={`form-group ${errors.date ? 'has-error' : ''}`}>
            <label htmlFor="date" className="col-sm-2 control-label">Date</label>
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                id="date"
                {...register('date', { required: 'Date is required' })}
              />
              {errors.date && <span className="help-block">{errors.date.message}</span>}
            </div>
          </div>

          <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
            <label htmlFor="description" className="col-sm-2 control-label">Description</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="description"
                {...register('description', { required: 'Description is required' })}
              />
              {errors.description && <span className="help-block">{errors.description.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-default" type="button" onClick={() => navigate(`/owners/${ownerId}`)}>Back</button>
              <button className="btn btn-default" type="submit" disabled={!isValid}>Add Visit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
