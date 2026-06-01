import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Specialty } from '../../types';
import { addVet } from '../../api/vets';
import { getSpecialties } from '../../api/specialties';

export default function VetAdd() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecIds, setSelectedSpecIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getSpecialties()
      .then(setAllSpecialties)
      .catch((err) => setErrorMessage(String(err)));
  }, []);

  const toggleSpec = (id: number) => {
    setSelectedSpecIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const specialties = allSpecialties.filter((s) => selectedSpecIds.includes(s.id));
    addVet({ firstName, lastName, specialties })
      .then(() => navigate('/vets'))
      .catch((err) => setErrorMessage(String(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Vet</h2>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="form-horizontal">
          <div className="form-group">
            <label htmlFor="firstName" className="col-sm-2 control-label">First Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="col-sm-2 control-label">Last Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-2 control-label">Specialties</label>
            <div className="col-sm-10">
              {allSpecialties.map((s) => (
                <label key={s.id} className="checkbox-inline">
                  <input
                    type="checkbox"
                    checked={selectedSpecIds.includes(s.id)}
                    onChange={() => toggleSpec(s.id)}
                  />
                  {s.name}
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button type="submit" className="btn btn-default">Add Vet</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
