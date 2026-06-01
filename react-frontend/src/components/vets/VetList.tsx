import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vet } from '../../types';
import { getVets, deleteVet } from '../../api/vets';

export default function VetList() {
  const navigate = useNavigate();
  const [vets, setVets] = useState<Vet[]>([]);
  const [filteredVets, setFilteredVets] = useState<Vet[]>([]);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [isDataReceived, setIsDataReceived] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getVets()
      .then((data) => {
        setVets(data);
        setFilteredVets(data);
      })
      .catch((err) => setErrorMessage(String(err)))
      .finally(() => setIsDataReceived(true));
  }, []);

  useEffect(() => {
    if (!specialtyFilter) {
      setFilteredVets(vets);
    } else {
      setFilteredVets(
        vets.filter((vet) =>
          vet.specialties.some((s) =>
            s.name.toLowerCase().includes(specialtyFilter.toLowerCase())
          )
        )
      );
    }
  }, [specialtyFilter, vets]);

  const handleDelete = (vet: Vet) => {
    deleteVet(vet.id)
      .then(() => setVets((prev) => prev.filter((v) => v.id !== vet.id)))
      .catch((err) => setErrorMessage(String(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Veterinarians</h2>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}

        <div className="form-group">
          <label htmlFor="specialtyFilter" className="control-label">Filter by specialty:</label>
          <input
            type="text"
            className="form-control"
            id="specialtyFilter"
            placeholder="Type a specialty name..."
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
          />
        </div>

        <table id="vets" className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialties</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredVets.map((vet) => (
              <tr key={vet.id}>
                <td>
                  {vet.firstName} {vet.lastName}
                </td>
                <td>
                  {vet.specialties.map((s) => (
                    <div key={s.id}>{s.name}</div>
                  ))}
                </td>
                <td>
                  <button className="btn btn-default" onClick={() => navigate(`/vets/${vet.id}/edit`)}>
                    Edit Vet
                  </button>
                  <button className="btn btn-default" onClick={() => handleDelete(vet)}>
                    Delete Vet
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isDataReceived && (
          <div>
            <button className="btn btn-default" onClick={() => navigate('/welcome')}>Home</button>
            <button className="btn btn-default" onClick={() => navigate('/vets/add')}>Add Vet</button>
          </div>
        )}
      </div>
    </div>
  );
}
