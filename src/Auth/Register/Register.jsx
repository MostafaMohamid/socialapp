import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { schema } from '../../schemas/schema';
import { AuthContext } from '../../Context/AuthContext';

export default function Register() {
  const { setUserToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  function submitForm(data) {
    setIsLoading(true);
    axios
      .post('https://route-posts.routemisr.com/users/signup', data)
      .then((response) => {
        if (response.data.message == 'account created') {
          Swal.fire({
            title: 'Account created',
            icon: 'success',
            draggable: true,
          });
          setUserToken(response.data.data.token);
          localStorage.setItem('token', response.data.data.token);
          navigate('/');
        }
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.message || err.response?.data?.error || err.response?.data?.massage;

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: errorMessage,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel auth-panel--wide">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-base font-bold text-primary-foreground shadow-sm">
            S
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-primary-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-secondary-foreground">Join SocialApp and start sharing</p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-3.5">
          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <Input {...register('name')} aria-label="Name" className="w-full" placeholder="Full name" />
              {formState.errors.name && formState.touchedFields.name ? (
                <p className="field-error">{formState.errors.name?.message}</p>
              ) : null}
            </div>
            <div>
              <Input
                {...register('username')}
                aria-label="Username"
                className="w-full"
                placeholder="Username"
              />
              {formState.errors.username && formState.touchedFields.username ? (
                <p className="field-error">{formState.errors.username?.message}</p>
              ) : null}
            </div>
          </div>

          <div>
            <Input {...register('email')} aria-label="Email" className="w-full" placeholder="Email" />
            {formState.errors.email && formState.touchedFields.email ? (
              <p className="field-error">{formState.errors?.email.message}</p>
            ) : null}
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <Input
                {...register('password')}
                type="password"
                aria-label="Password"
                className="w-full"
                placeholder="Password"
              />
              {formState.errors.password && formState.touchedFields.password ? (
                <p className="field-error">{formState.errors.password?.message}</p>
              ) : null}
            </div>
            <div>
              <Input
                {...register('rePassword')}
                type="password"
                aria-label="Confirm password"
                className="w-full"
                placeholder="Confirm password"
              />
              {formState.errors.rePassword && formState.touchedFields.rePassword ? (
                <p className="field-error">{formState.errors.rePassword?.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <Input
                {...register('dateOfBirth')}
                type="date"
                aria-label="Date of birth"
                className="w-full"
              />
              {formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth ? (
                <p className="field-error">{formState.errors.dateOfBirth?.message}</p>
              ) : null}
            </div>
            <div>
              <select
                {...register('gender')}
                defaultValue=""
                className="block w-full rounded-xl border border-default-medium bg-neutral-secondary-medium px-3 py-2 text-sm text-primary-foreground shadow-xs focus:border-brand focus:ring-brand"
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {formState.errors.gender && formState.touchedFields.gender ? (
                <p className="field-error">{formState.errors.gender?.message}</p>
              ) : null}
            </div>
          </div>

          <Button type="submit" isDisabled={isLoading} className="mt-2 w-full">
            {isLoading ? 'Loading...' : 'Create account'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-secondary-foreground">
          Already have an account?{' '}
          <Link to="/" className="font-medium text-primary-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
