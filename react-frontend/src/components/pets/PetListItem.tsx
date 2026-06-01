import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pet } from '../../types';
import { deletePet } from '../../api/pets';
import VisitList from '../visits/VisitList';

interface Props {
  pet: Pet;
  onPetDeleted: () => void;
}

export default function PetListItem({ pet, onPetDeleted }: Props) {
  const navigate = useNavigate();
  const [deleted, setDeleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = () => {
    deletePet(pet.id)
      .then(() => {
        setDeleted(true);
        onPetDeleted();
      })
      .catch((err) => setErrorMessage(String(err)));
  };

  if (deleted) return null;

  return (
    <>
      <td valign="top">
        <dl className="dl-horizontal">
          <dt>Name</dt>
          <dd>{pet.name}</dd>
          <dt>Birth Date</dt>
          <dd>{pet.birthDate}</dd>
          <dt>Type</dt>
          <dd>{pet.type?.name}</dd>
          <button className="btn btn-default" onClick={() => navigate(`/pets/${pet.id}/edit`)}>
            Edit Pet
          </button>
          <button className="btn btn-default" onClick={handleDelete}>
            Delete Pet
          </button>
          <button className="btn btn-default" onClick={() => navigate(`/pets/${pet.id}/visits/add`)}>
            Add Visit
          </button>
        </dl>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
      </td>
      <td valign="top">
        <VisitList visits={pet.visits || []} />
      </td>
    </>
  );
}
