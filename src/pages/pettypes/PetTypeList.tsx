import { useNavigate } from 'react-router-dom';
import { usePetTypes, usePetTypeMutations } from '../../hooks/usePetTypes';

export default function PetTypeList() {
  const navigate = useNavigate();
  const { data: petTypes, isLoading } = usePetTypes();
  const { deleteMutation } = usePetTypeMutations();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Pet Types</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {petTypes?.map((pt) => (
              <tr key={pt.id}>
                <td>{pt.name}</td>
                <td>
                  <button className="btn btn-default btn-xs" onClick={() => navigate(`/pettypes/${pt.id}/edit`)}>Edit</button>
                  <button className="btn btn-default btn-xs" onClick={() => deleteMutation.mutate(pt.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-default" onClick={() => navigate('/pettypes/add')}>Add</button>
      </div>
    </div>
  );
}
