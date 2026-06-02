import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitService } from '../../api/visitService';
import { extractErrorMessage } from '../../api/httpClient';
import type { Visit } from '../../types';

function VisitList() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    visitService.getVisits()
      .then(setVisits)
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }, []);

  function handleDelete(visit: Visit) {
    visitService.deleteVisit(visit.id)
      .then(() => setVisits((prev) => prev.filter((v) => v.id !== visit.id)))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>Visits</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Pet</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((v) => (
            <tr key={v.id}>
              <td>{v.date}</td>
              <td>{v.pet?.name}</td>
              <td>{v.description}</td>
              <td>
                <button className="btn btn-sm" onClick={() => navigate(`/visits/${v.id}/edit`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(v)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="help-text">To add a visit, go to the pet&apos;s owner detail page and click &quot;Add Visit&quot; on the pet.</p>
    </div>
  );
}

export default VisitList;
