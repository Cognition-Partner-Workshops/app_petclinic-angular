import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Visit } from '../../types';
import { deleteVisit } from '../../api/visits';

interface Props {
  visits: Visit[];
}

export default function VisitList({ visits: initialVisits }: Props) {
  const navigate = useNavigate();
  const [visits, setVisits] = useState<Visit[]>(initialVisits);

  useEffect(() => {
    setVisits(initialVisits);
  }, [initialVisits]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = (visit: Visit) => {
    deleteVisit(visit.id)
      .then(() => setVisits((prev) => prev.filter((v) => v.id !== visit.id)))
      .catch((err) => setErrorMessage(String(err)));
  };

  if (visits.length === 0) return <p>No visits</p>;

  return (
    <div>
      {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.id}>
              <td>{visit.date}</td>
              <td>{visit.description}</td>
              <td>
                <button className="btn btn-default btn-sm" onClick={() => navigate(`/visits/${visit.id}/edit`)}>
                  Edit
                </button>
                <button className="btn btn-default btn-sm" onClick={() => handleDelete(visit)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
