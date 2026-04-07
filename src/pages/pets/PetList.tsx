import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPets } from '../../api/petApi';
import { usePetMutations } from '../../hooks/usePets';

export default function PetList() {
  const navigate = useNavigate();
  const { data: pets, isLoading } = useQuery({ queryKey: ['pets'], queryFn: getPets });
  const { deleteMutation } = usePetMutations();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Pets</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Birth Date</th>
              <th>Type</th>
              <th>Owner</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pets?.map((pet) => (
              <tr key={pet.id}>
                <td>{pet.name}</td>
                <td>{pet.birthDate}</td>
                <td>{pet.type?.name}</td>
                <td>
                  {pet.owner && (
                    <Link to={`/owners/${pet.owner.id}`}>
                      {pet.owner.firstName} {pet.owner.lastName}
                    </Link>
                  )}
                </td>
                <td>
                  <button className="btn btn-default btn-xs" onClick={() => navigate(`/owners/${pet.ownerId}/pets/${pet.id}/edit`)}>Edit</button>
                  <button className="btn btn-default btn-xs" onClick={() => deleteMutation.mutate(pet.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
