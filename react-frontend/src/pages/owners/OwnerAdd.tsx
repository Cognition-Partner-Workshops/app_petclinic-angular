import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOwner } from '../../api/ownerApi';
import { extractErrorMessage } from '../../api/errorUtils';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  telephone?: string;
}

function validate(values: Record<string, string>): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName) errors.firstName = 'First name is required';
  else if (!/^[a-zA-Z]*$/.test(values.firstName))
    errors.firstName = 'First name must consist of letters only';

  if (!values.lastName) errors.lastName = 'Last name is required';
  else if (!/^[a-zA-Z]*$/.test(values.lastName))
    errors.lastName = 'Last name must consist of letters only';

  if (!values.address) errors.address = 'Address is required';

  if (!values.city) errors.city = 'City is required';

  if (!values.telephone) errors.telephone = 'Phone number is required';
  else if (!/^[0-9]*$/.test(values.telephone))
    errors.telephone = 'Phone number only accept digits';

  return errors;
}

export default function OwnerAdd() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    telephone: '',
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [serverError, setServerError] = useState('');

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    addOwner(form)
      .then(() => navigate('/owners'))
      .catch((err) => setServerError(extractErrorMessage(err)));
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>New Owner</h2>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {(['firstName', 'lastName', 'address', 'city', 'telephone'] as const).map(
            (field) => (
              <div
                key={field}
                className={`form-group has-feedback ${
                  touched[field]
                    ? errors[field]
                      ? 'has-error'
                      : 'has-success'
                    : ''
                }`}
              >
                <label htmlFor={`owner-${field}`} className="col-sm-2 control-label">
                  {field === 'firstName'
                    ? 'First Name'
                    : field === 'lastName'
                      ? 'Last Name'
                      : field === 'telephone'
                        ? 'Telephone'
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className="col-sm-10">
                  <input
                    id={`owner-${field}`}
                    type="text"
                    className="form-control"
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    onBlur={() =>
                      setTouched((prev) => ({ ...prev, [field]: true }))
                    }
                  />
                  {touched[field] && errors[field] && (
                    <span className="help-block">{errors[field]}</span>
                  )}
                </div>
              </div>
            )
          )}
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button
                className="btn btn-default"
                type="button"
                onClick={() => navigate('/owners')}
              >
                Back
              </button>
              <button
                className="btn btn-default"
                type="submit"
                disabled={!isValid}
              >
                Add Owner
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
