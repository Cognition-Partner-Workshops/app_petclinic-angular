import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useOwner, useOwnerMutations } from '../../hooks/useOwners';

interface OwnerFormData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
}

export default function OwnerEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: owner, isLoading } = useOwner(Number(id));
  const { updateMutation } = useOwnerMutations();
  const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<OwnerFormData>({ mode: 'onChange' });

  useEffect(() => {
    if (owner) {
      reset({
        firstName: owner.firstName,
        lastName: owner.lastName,
        address: owner.address,
        city: owner.city,
        telephone: owner.telephone,
      });
    }
  }, [owner, reset]);

  if (isLoading) return <div>Loading...</div>;

  const onSubmit = (data: OwnerFormData) => {
    updateMutation.mutate(
      { id: Number(id), owner: { ...data, id: Number(id) } },
      { onSuccess: () => navigate(`/owners/${id}`) }
    );
  };

  return (
    <div className="container-fluid">
      <div className="container xd-container">
        <h2>Edit Owner</h2>
        {updateMutation.error && (
          <div className="alert alert-danger">{String(updateMutation.error)}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="form-horizontal">
          <div className={`form-group has-feedback ${errors.firstName ? 'has-error' : 'has-success'}`}>
            <label htmlFor="firstName" className="col-sm-2 control-label">First Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="firstName"
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: { value: 1, message: 'First name must be at least 1 characters long' },
                  maxLength: { value: 30, message: 'First name may be at most 30 characters long' },
                  pattern: { value: /^[a-zA-Z]*$/, message: 'First name must consist of letters only' },
                })}
              />
              <span className={`glyphicon form-control-feedback ${errors.firstName ? 'glyphicon-remove' : 'glyphicon-ok'}`} aria-hidden="true"></span>
              {errors.firstName && <span className="help-block">{errors.firstName.message}</span>}
            </div>
          </div>

          <div className={`form-group has-feedback ${errors.lastName ? 'has-error' : 'has-success'}`}>
            <label htmlFor="lastName" className="col-sm-2 control-label">Last Name</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="lastName"
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: { value: 1, message: 'Last name must be at least 1 characters long' },
                  maxLength: { value: 30, message: 'Last name may be at most 30 characters long' },
                  pattern: { value: /^[a-zA-Z]*$/, message: 'Last name must consist of letters only' },
                })}
              />
              <span className={`glyphicon form-control-feedback ${errors.lastName ? 'glyphicon-remove' : 'glyphicon-ok'}`} aria-hidden="true"></span>
              {errors.lastName && <span className="help-block">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className={`form-group has-feedback ${errors.address ? 'has-error' : 'has-success'}`}>
            <label htmlFor="address" className="col-sm-2 control-label">Address</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="address"
                {...register('address', {
                  required: 'Address is required',
                  maxLength: { value: 255, message: 'Address may be at most 255 characters long' },
                })}
              />
              <span className={`glyphicon form-control-feedback ${errors.address ? 'glyphicon-remove' : 'glyphicon-ok'}`} aria-hidden="true"></span>
              {errors.address && <span className="help-block">{errors.address.message}</span>}
            </div>
          </div>

          <div className={`form-group has-feedback ${errors.city ? 'has-error' : 'has-success'}`}>
            <label htmlFor="city" className="col-sm-2 control-label">City</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="city"
                {...register('city', {
                  required: 'City is required',
                  maxLength: { value: 80, message: 'City may be at most 80 characters long' },
                })}
              />
              <span className={`glyphicon form-control-feedback ${errors.city ? 'glyphicon-remove' : 'glyphicon-ok'}`} aria-hidden="true"></span>
              {errors.city && <span className="help-block">{errors.city.message}</span>}
            </div>
          </div>

          <div className={`form-group has-feedback ${errors.telephone ? 'has-error' : 'has-success'}`}>
            <label htmlFor="telephone" className="col-sm-2 control-label">Telephone</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="telephone"
                {...register('telephone', {
                  required: 'Phone number is required',
                  minLength: { value: 1, message: 'Phone number must be at least one digit long' },
                  maxLength: { value: 20, message: 'Phone number cannot be more than 20 digits long' },
                  pattern: { value: /^[0-9]*$/, message: 'Phone number only accept digits' },
                })}
              />
              <span className={`glyphicon form-control-feedback ${errors.telephone ? 'glyphicon-remove' : 'glyphicon-ok'}`} aria-hidden="true"></span>
              {errors.telephone && <span className="help-block">{errors.telephone.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-default" type="button" onClick={() => navigate(`/owners/${id}`)}>Back</button>
              <button type="submit" disabled={!isValid} className="btn btn-default">Update Owner</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
