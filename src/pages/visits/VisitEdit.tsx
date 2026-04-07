import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useVisit, useVisitMutations } from '../../hooks/useVisits';

interface VisitFormData {
  date: string;
  description: string;
}

export default function VisitEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: visit, isLoading } = useVisit(Number(id));
  const { updateMutation } = useVisitMutations();
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<VisitFormData>({ mode: 'onChange' });

  useEffect(() => {
    if (visit) {
      reset({
        date: visit.date,
        description: visit.description,
      });
    }
  }, [visit, reset]);

  if (isLoading) return <div>Loading...</div>;

  const onSubmit = (data: VisitFormData) => {
    updateMutation.mutate(
      { id: Number(id), visit: { ...data, id: Number(id) } },
      { onSuccess: () => navigate(-1 as unknown as string) }
    );
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Visit</h2>
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
              <button className="btn btn-default" type="button" onClick={() => navigate(-1)}>Back</button>
              <button className="btn btn-default" type="submit" disabled={!isValid}>Update Visit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
