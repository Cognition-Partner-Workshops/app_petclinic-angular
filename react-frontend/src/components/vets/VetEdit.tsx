import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Vet, Specialty } from '../../types';
import { getVetById, updateVet } from '../../api/vets';
import { getSpecialties } from '../../api/specialties';

export default function VetEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [vet, setVet] = useState<Vet | null>(null);
  const [allSpecialties, setAllSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecIds, setSelectedSpecIds] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getSpecialties()
      .then(setAllSpecialties)
      .catch((err) => setErrorMessage(String(err)));

    if (id) {
      getVetById(Number(id)).then((v) => {
        setVet(v);
        setSelectedSpecIds(v.specialties.map((s) => s.id));
      }).catch((err) => setErrorMessage(String(err)));
    }
  }, [id]);

  if (errorMessage) return <div className="alert alert-warning">{errorMessage}</div>;
  if (!vet) return <div>Loading...</div>;

  const toggleSpec = (specId: number) => {
    setSelectedSpecIds((prev) =>
      prev.includes(specId) ? prev.filter((s) => s !== specId) : [...prev, specId]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const specialties = allSpecialties.filter((s) => selectedSpecIds.includes(s.id));
    updateVet(vet.id, { ...vet, specialties })
      .then(() => navigate('/vets'))
      .catch((err) => setErrorMessage(String(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Vet</h2>
        {errorMessage && <div className="alert alert-warning">{errorMessage}</div>}
        <form onSubmit={handleSubmit} className="form-horizontal">
          <div className="form-group">
            <label htmlFor="firstName" className="col-sm-2 control-label">First Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="firstName" value={vet.firstName || ''} onChange={(e) => setVet({ ...vet, firstName: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="lastName" className="col-sm-2 control-label">Last Name</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="lastName" value={vet.lastName || ''} onChange={(e) => setVet({ ...vet, lastName: e.target.value })} required />
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
              <button type="submit" className="btn btn-default">Update Vet</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
