import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addOwner } from '../../services/ownerService';

interface FormErrors {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  telephone?: string;
}

function validate(field: string, value: string): string | undefined {
  switch (field) {
    case 'firstName':
      if (!value) return 'First name is required';
      if (value.length > 30) return 'First name may be at most 30 characters long';
      if (!/^[a-zA-Z]*$/.test(value)) return 'First name must consist of letters only';
      return undefined;
    case 'lastName':
      if (!value) return 'Last name is required';
      if (value.length > 30) return 'Last name may be at most 30 characters long';
      if (!/^[a-zA-Z]*$/.test(value)) return 'Last name must consist of letters only';
      return undefined;
    case 'address':
      if (!value) return 'Address is required';
      if (value.length > 255) return 'Address may be at most 255 characters long';
      return undefined;
    case 'city':
      if (!value) return 'City is required';
      if (value.length > 80) return 'City may be at most 80 characters long';
      return undefined;
    case 'telephone':
      if (!value) return 'Phone number is required';
      if (value.length > 20) return 'Phone number cannot be more than 20 digits long';
      if (!/^[0-9]*$/.test(value)) return 'Phone number only accept digits';
      return undefined;
    default:
      return undefined;
  }
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errorMessage, setErrorMessage] = useState('');

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validate(field, value) }));
    }
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(field, form[field as keyof typeof form]) }));
  }

  function isFormValid(): boolean {
    const fields = ['firstName', 'lastName', 'address', 'city', 'telephone'] as const;
    return fields.every((f) => !validate(f, form[f]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fields = ['firstName', 'lastName', 'address', 'city', 'telephone'] as const;
    const newErrors: FormErrors = {};
    const newTouched: Record<string, boolean> = {};
    for (const f of fields) {
      newErrors[f] = validate(f, form[f]);
      newTouched[f] = true;
    }
    setErrors(newErrors);
    setTouched(newTouched);
    if (!isFormValid()) return;

    addOwner(form)
      .then(() => navigate('/owners'))
      .catch((err: string) => setErrorMessage(err));
  }

  return (
    <div className="container xd-container">
      <h2>New Owner</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form className="form-horizontal" onSubmit={handleSubmit}>
        <div className={`form-group has-feedback ${touched.firstName ? (errors.firstName ? 'has-error' : 'has-success') : ''}`}>
          <label htmlFor="firstName" className="col-sm-2 control-label">First Name</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              maxLength={30}
              required
            />
            {touched.firstName && errors.firstName && (
              <span className="help-block">{errors.firstName}</span>
            )}
          </div>
        </div>

        <div className={`form-group has-feedback ${touched.lastName ? (errors.lastName ? 'has-error' : 'has-success') : ''}`}>
          <label htmlFor="lastName" className="col-sm-2 control-label">Last Name</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              maxLength={30}
              required
            />
            {touched.lastName && errors.lastName && (
              <span className="help-block">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className={`form-group has-feedback ${touched.address ? (errors.address ? 'has-error' : 'has-success') : ''}`}>
          <label htmlFor="address" className="col-sm-2 control-label">Address</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="address"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              maxLength={255}
              required
            />
            {touched.address && errors.address && (
              <span className="help-block">{errors.address}</span>
            )}
          </div>
        </div>

        <div className={`form-group has-feedback ${touched.city ? (errors.city ? 'has-error' : 'has-success') : ''}`}>
          <label htmlFor="city" className="col-sm-2 control-label">City</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="city"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              maxLength={80}
              required
            />
            {touched.city && errors.city && (
              <span className="help-block">{errors.city}</span>
            )}
          </div>
        </div>

        <div className={`form-group has-feedback ${touched.telephone ? (errors.telephone ? 'has-error' : 'has-success') : ''}`}>
          <label htmlFor="telephone" className="col-sm-2 control-label">Telephone</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              id="telephone"
              value={form.telephone}
              onChange={(e) => handleChange('telephone', e.target.value)}
              onBlur={() => handleBlur('telephone')}
              maxLength={20}
              required
            />
            {touched.telephone && errors.telephone && (
              <span className="help-block">{errors.telephone}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <div className="col-sm-offset-2 col-sm-10">
            <button className="btn btn-default" type="button" onClick={() => navigate('/owners')}>
              Back
            </button>
            <button className="btn btn-default" type="submit" disabled={!isFormValid()}>
              Add Owner
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
