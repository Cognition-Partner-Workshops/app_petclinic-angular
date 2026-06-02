import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { petTypeService } from '../../api/petTypeService';
import { extractErrorMessage } from '../../api/httpClient';
import type { PetType } from '../../types';

function PetTypeList() {
  const [petTypes, setPetTypes] = useState<PetType[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    petTypeService.getPetTypes()
      .then(setPetTypes)
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }, []);

  function handleDelete(pt: PetType) {
    petTypeService.deletePetType(pt.id)
      .then(() => setPetTypes((prev) => prev.filter((t) => t.id !== pt.id)))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>Pet Types</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {petTypes.map((pt) => (
            <tr key={pt.id}>
              <td>{pt.name}</td>
              <td>
                <button className="btn btn-sm" onClick={() => navigate(`/pettypes/${pt.id}/edit`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(pt)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn" onClick={() => navigate('/pettypes/add')}>Add Pet Type</button>
    </div>
  );
}

export default PetTypeList;
