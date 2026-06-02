import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vetService } from '../../api/vetService';
import { extractErrorMessage } from '../../api/httpClient';
import type { Vet } from '../../types';

function VetList() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    vetService.getVets()
      .then(setVets)
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }, []);

  function handleDelete(vet: Vet) {
    vetService.deleteVet(vet.id)
      .then(() => setVets((prev) => prev.filter((v) => v.id !== vet.id)))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>Veterinarians</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialties</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vets.map((vet) => (
            <tr key={vet.id}>
              <td>{vet.firstName} {vet.lastName}</td>
              <td>{vet.specialties?.map((s) => s.name).join(', ')}</td>
              <td>
                <button className="btn btn-sm" onClick={() => navigate(`/vets/${vet.id}/edit`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(vet)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn" onClick={() => navigate('/vets/add')}>Add Vet</button>
    </div>
  );
}

export default VetList;
