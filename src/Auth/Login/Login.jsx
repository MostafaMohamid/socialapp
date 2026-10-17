import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { schemaLogin } from '../../schemas/scemaLogin';
import { AuthContext } from '../../Context/AuthContext';

const LOGIN_ERROR_MESSAGE = 'Wrong email or password';

export default function Login() {
  const { setUserToken, getUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState, setError } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(schemaLogin),
  });

  function submitForm(data) {
    setIsLoading(true);

    axios
      .post('https://route-posts.routemisr.com/users/signin', data)
      .then(async (response) => {
        if (response.data.success == true) {
          Swal.fire({
            title: 'Signed in successfully',
            icon: 'success',
            draggable: true,
          });
          setUserToken(response.data.data.token);
          localStorage.setItem('token', response.data.data.token);
          await getUserData();
          navigate('/home');
        }
        else if (response.data.success == false) {
          setError('password', {
            type: 'manual',
            message: response.data.message || response.data.errors || LOGIN_ERROR_MESSAGE,
          });
        }
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: LOGIN_ERROR_MESSAGE,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="auth-shell">
      <div className="auth-panel">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 text-base font-bold text-primary-foreground shadow-sm">
            S
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-primary-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-secondary-foreground">Sign in to continue to SocialApp</p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="flex flex-col gap-4">
          <div>
            <Input {...register('email')} aria-label="Email" className="w-full" placeholder="Email" />
            {formState.errors.email ? (
              <p className=" text-red-400  text-sm">{formState.errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <Input
              {...register('password')}
              type="password"
              aria-label="Password"
              className="w-full"
              placeholder="Password"
            />
            {formState.errors.password ? (
              <p className=" text-red-400  text-sm" >
                {formState.errors.password.message}
              </p>
            ) : null}
          </div>

          <Button type="submit" isDisabled={isLoading} className="mt-2 w-full">
            {isLoading ? 'Loading...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-secondary-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-primary-foreground hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
