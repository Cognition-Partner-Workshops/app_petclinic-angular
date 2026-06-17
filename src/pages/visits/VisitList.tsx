import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getVisits } from '../../api/visitApi';
import { useVisitMutations } from '../../hooks/useVisits';

export default function VisitList() {
  const navigate = useNavigate();
  const { data: visits, isLoading } = useQuery({ queryKey: ['visits'], queryFn: getVisits });
  const { deleteMutation } = useVisitMutations();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Visits</h2>
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
            {visits?.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.date}</td>
                <td>{visit.description}</td>
                <td>{visit.pet?.name}</td>
                <td>
                  <button className="btn btn-default btn-xs" onClick={() => navigate(`/visits/${visit.id}/edit`)}>Edit</button>
                  <button className="btn btn-default btn-xs" onClick={() => deleteMutation.mutate(visit.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
