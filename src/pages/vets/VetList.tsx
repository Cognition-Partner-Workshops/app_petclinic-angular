import { useNavigate } from 'react-router-dom';
import { useVets, useVetMutations } from '../../hooks/useVets';

export default function VetList() {
  const navigate = useNavigate();
  const { data: vets, isLoading } = useVets();
  const { deleteMutation } = useVetMutations();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Veterinarians</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialties</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vets?.map((vet) => (
              <tr key={vet.id}>
                <td>{vet.firstName} {vet.lastName}</td>
                <td>
                  {vet.specialties?.length
                    ? vet.specialties.map((s) => s.name).join(', ')
                    : 'none'}
                </td>
                <td>
                  <button className="btn btn-default btn-xs" onClick={() => navigate(`/vets/${vet.id}/edit`)}>Edit</button>
                  <button className="btn btn-default btn-xs" onClick={() => deleteMutation.mutate(vet.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-default" onClick={() => navigate('/vets/add')}>Add Vet</button>
      </div>
    </div>
  );
}
