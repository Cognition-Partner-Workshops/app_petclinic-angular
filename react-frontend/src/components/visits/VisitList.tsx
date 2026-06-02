import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Visit } from '../../types';
import { getVisits, deleteVisit } from '../../services/visitService';

export default function VisitList() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getVisits()
      .then((data) => setVisits(data))
      .catch((err: string) => setErrorMessage(err));
  }, []);

  function handleDelete(visitId: number) {
    if (confirm('Are you sure you want to delete this visit?')) {
      deleteVisit(visitId)
        .then(() => setVisits((prev) => prev.filter((v) => v.id !== visitId)))
        .catch((err: string) => setErrorMessage(err));
    }
  }

  return (
    <div className="container xd-container">
      <h2>Visits</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Pet</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.id}>
              <td>{visit.date}</td>
              <td>{visit.description}</td>
              <td>{visit.pet?.name || ''}</td>
              <td>
                <button className="btn btn-default btn-sm" onClick={() => navigate(`/visits/${visit.id}/edit`)}>
                  Edit
                </button>
                <button className="btn btn-default btn-sm" onClick={() => handleDelete(visit.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-default" onClick={() => navigate('/visits/add')}>
        Add Visit
      </button>
    </div>
  );
}
