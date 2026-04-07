import { useParams, useNavigate } from 'react-router-dom';
import { useOwner } from '../../hooks/useOwners';
import { usePetMutations } from '../../hooks/usePets';
import { useVisitMutations } from '../../hooks/useVisits';
import { Pet } from '../../models/Pet';
import { Visit } from '../../models/Visit';

function VisitList({ visits, onEditVisit, onDeleteVisit }: {
  visits: Visit[];
  onEditVisit: (visit: Visit) => void;
  onDeleteVisit: (visit: Visit) => void;
}) {
  if (!visits || visits.length === 0) return null;
  return (
    <table className="table table-condensed">
      <thead>
        <tr>
          <th>Visit Date</th>
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
              <button className="btn btn-default" onClick={() => onEditVisit(visit)}>Edit Visit</button>
              <button className="btn btn-default" onClick={() => onDeleteVisit(visit)}>Delete Visit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PetListItem({ pet, onEditPet, onDeletePet, onAddVisit, onEditVisit, onDeleteVisit }: {
  pet: Pet;
  onEditPet: (pet: Pet) => void;
  onDeletePet: (pet: Pet) => void;
  onAddVisit: (pet: Pet) => void;
  onEditVisit: (visit: Visit) => void;
  onDeleteVisit: (visit: Visit) => void;
}) {
  return (
    <table className="table table-striped">
      <tbody>
        <tr>
          <td valign="top">
            <dl className="dl-horizontal">
              <dt>Name</dt>
              <dd>{pet.name}</dd>
              <dt>Birth Date</dt>
              <dd>{pet.birthDate}</dd>
              <dt>Type</dt>
              <dd>{pet.type?.name}</dd>
            </dl>
            <button className="btn btn-default" onClick={() => onEditPet(pet)}>Edit Pet</button>
            <button className="btn btn-default" onClick={() => onDeletePet(pet)}>Delete Pet</button>
            <button className="btn btn-default" onClick={() => onAddVisit(pet)}>Add Visit</button>
          </td>
          <td valign="top">
            <VisitList visits={pet.visits} onEditVisit={onEditVisit} onDeleteVisit={onDeleteVisit} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default function OwnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: owner, isLoading } = useOwner(Number(id));
  const { deleteMutation: deletePetMutation } = usePetMutations();
  const { deleteMutation: deleteVisitMutation } = useVisitMutations();

  if (isLoading || !owner) return <div>Loading...</div>;

  const handleEditPet = (pet: Pet) => navigate(`/pets/${pet.id}/edit`);
  const handleDeletePet = (pet: Pet) => deletePetMutation.mutate(pet.id);
  const handleAddVisit = (pet: Pet) => navigate(`/pets/${pet.id}/visits/add`);
  const handleEditVisit = (visit: Visit) => navigate(`/visits/${visit.id}/edit`);
  const handleDeleteVisit = (visit: Visit) => deleteVisitMutation.mutate(visit.id);

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Owner Information</h2>
        <table className="table table-striped">
          <tbody>
            <tr>
              <th>Name</th>
              <td><b className="ownerFullName">{owner.firstName} {owner.lastName}</b></td>
            </tr>
            <tr>
              <th>Address</th>
              <td>{owner.address}</td>
            </tr>
            <tr>
              <th>City</th>
              <td>{owner.city}</td>
            </tr>
            <tr>
              <th>Telephone</th>
              <td>{owner.telephone}</td>
            </tr>
          </tbody>
        </table>

        <button className="btn btn-default" onClick={() => navigate('/owners')}>Back</button>
        <button className="btn btn-default" onClick={() => navigate(`/owners/${owner.id}/edit`)}>Edit Owner</button>
        <button className="btn btn-default" onClick={() => navigate(`/owners/${owner.id}/pets/add`)}>Add New Pet</button>

        <br /><br /><br />
        <h2>Pets and Visits</h2>

        {owner.pets?.map((pet) => (
          <PetListItem
            key={pet.id}
            pet={pet}
            onEditPet={handleEditPet}
            onDeletePet={handleDeletePet}
            onAddVisit={handleAddVisit}
            onEditVisit={handleEditVisit}
            onDeleteVisit={handleDeleteVisit}
          />
        ))}
      </div>
    </div>
  );
}
