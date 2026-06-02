import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { visitService } from '../../api/visitService';
import { extractErrorMessage } from '../../api/httpClient';

function VisitEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (id) {
      visitService.getVisitById(Number(id)).then((visit) => {
        setDate(visit.date || '');
        setDescription(visit.description || '');
      }).catch((err) => setErrorMessage(extractErrorMessage(err)));
    }
  }, [id]);

  const errors: Record<string, string> = {};
  if (!date) errors.date = 'Date is required';
  if (!description) errors.description = 'Description is required';

  const isValid = Object.keys(errors).length === 0;

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ date: true, description: true });
    if (!isValid || !id) return;
    visitService.updateVisit(Number(id), { id: Number(id), date, description })
      .then(() => navigate('/visits'))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>Edit Visit</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={`form-group ${touched.date && errors.date ? 'has-error' : ''}`}>
          <label className="col-label">Date</label>
          <input type="date" className="form-control" value={date}
            onChange={(e) => setDate(e.target.value)} onBlur={() => handleBlur('date')} />
          {touched.date && errors.date && <span className="help-block">{errors.date}</span>}
        </div>
        <div className={`form-group ${touched.description && errors.description ? 'has-error' : ''}`}>
          <label className="col-label">Description</label>
          <input className="form-control" value={description}
            onChange={(e) => setDescription(e.target.value)} onBlur={() => handleBlur('description')} />
          {touched.description && errors.description && <span className="help-block">{errors.description}</span>}
        </div>
        <div className="form-actions">
          <button type="button" className="btn" onClick={() => navigate('/visits')}>Back</button>
          <button type="submit" className="btn btn-primary" disabled={!isValid}>Update Visit</button>
        </div>
      </form>
    </div>
  );
}

export default VisitEdit;
