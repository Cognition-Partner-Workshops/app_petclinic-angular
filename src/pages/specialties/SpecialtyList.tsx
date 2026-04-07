import { useNavigate } from 'react-router-dom';
import { useSpecialties, useSpecialtyMutations } from '../../hooks/useSpecialties';

export default function SpecialtyList() {
  const navigate = useNavigate();
  const { data: specialties, isLoading } = useSpecialties();
  const { deleteMutation } = useSpecialtyMutations();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Specialties</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {specialties?.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>
                  <button className="btn btn-default btn-xs" onClick={() => navigate(`/specialties/${s.id}/edit`)}>Edit</button>
                  <button className="btn btn-default btn-xs" onClick={() => deleteMutation.mutate(s.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-default" onClick={() => navigate('/specialties/add')}>Add</button>
      </div>
    </div>
  );
}
