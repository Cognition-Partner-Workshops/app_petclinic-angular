import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Visit } from '../../types';
import { getVisits, deleteVisit } from '../../api/visitApi';
import { extractErrorMessage } from '../../api/errorUtils';

export default function VisitList() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getVisits()
      .then((data) => setVisits(data))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }, []);

  const handleDelete = (visit: Visit) => {
    deleteVisit(visit.id)
      .then(() => setVisits((prev) => prev.filter((v) => v.id !== visit.id)))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Visits</h2>

        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Visit Date</th>
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
                  <button
                    className="btn btn-default"
                    onClick={() => navigate(`/visits/${visit.id}/edit`)}
                  >
                    Edit Visit
                  </button>
                  <button
                    className="btn btn-default"
                    onClick={() => handleDelete(visit)}
                  >
                    Delete Visit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
