import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Visit } from '../../types';
import { getVisitById, updateVisit } from '../../api/visits';

export default function VisitEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!id) return;
    getVisitById(Number(id))
      .then(setVisit)
      .catch((err) => setErrorMessage(String(err)));
  }, [id]);

  if (!visit) {
    if (errorMessage) return <div className="alert alert-warning">{errorMessage}</div>;
    return <div>Loading...</div>;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateVisit(visit.id, visit)
      .then(() => navigate('/owners'))
      .catch((err) => setErrorMessage(String(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Visit</h2>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="form-horizontal">
          <div className="form-group">
            <label htmlFor="date" className="col-sm-2 control-label">Date</label>
            <div className="col-sm-10">
              <input type="date" className="form-control" id="date" value={visit.date || ''} onChange={(e) => setVisit({ ...visit, date: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description" className="col-sm-2 control-label">Description</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="description" value={visit.description || ''} onChange={(e) => setVisit({ ...visit, description: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">Update Visit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
