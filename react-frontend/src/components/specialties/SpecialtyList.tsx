import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { specialtyService } from '../../api/specialtyService';
import { extractErrorMessage } from '../../api/httpClient';
import type { Specialty } from '../../types';

function SpecialtyList() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    specialtyService.getSpecialties()
      .then(setSpecialties)
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }, []);

  function handleDelete(spec: Specialty) {
    specialtyService.deleteSpecialty(spec.id)
      .then(() => setSpecialties((prev) => prev.filter((s) => s.id !== spec.id)))
      .catch((err) => setErrorMessage(extractErrorMessage(err)));
  }

  return (
    <div className="container">
      <h2>Specialties</h2>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {specialties.map((spec) => (
            <tr key={spec.id}>
              <td>{spec.name}</td>
              <td>
                <button className="btn btn-sm" onClick={() => navigate(`/specialties/${spec.id}/edit`)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(spec)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn" onClick={() => navigate('/specialties/add')}>Add Specialty</button>
    </div>
  );
}

export default SpecialtyList;
