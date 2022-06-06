import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthState, signin } from '../firebase/config';
import CircleIcon from '@mui/icons-material/Circle';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const SignIn = () => {
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState('Sign In');
  let navigate = useNavigate();
  let location = useLocation();
  const unprotectedPaths = location.state?.from?.pathname == '/signin' || location.state?.from?.pathname == '/signup';

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Email Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      errors.password = 'Password Required';
    }

    return errors;
  };

  return (
    <div>
      <div>
        <div class='min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div class='max-w-md w-full space-y-8'>
            <div>
              <div class='flex flex-col justify-center items-center text-red text-6xl'>
                <CircleIcon />
              </div>
              <h2 class='mt-6 text-center text-3xl font-extrabold text-gray-900'>Sign in </h2>
              <p class='mt-2 text-center text-sm text-gray-600'>Sign into your account</p>
            </div>

            <Formik
              initialValues={{ email: '', password: '' }}
              validate={validate}
              onSubmit={(values, formikBag) => {
                setLoadingSpinner('Signing In....');
                setTimeout(() => {
                  // alert(JSON.stringify(values, null, 2));
                  formikBag.setSubmitting(false);
                  signin(values?.email, values?.password)
                    .then((userCredential) => {
                      // Signed in
                      const user = userCredential.user;
                      if (user) {
                        setLoading(false);
                      }
                      console.log('user sign in successful!');
                      if (unprotectedPaths === true) {
                        let from = '/';
                        navigate(from, { replace: true });
                      }

                      if (unprotectedPaths === false) {
                        let from = location.state?.from?.pathname || '/';
                        navigate(from, { replace: true });
                      }
                    })
                    .catch((error) => {
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      console.log(errorCode);
                      if (errorCode == 'auth/wrong-password') {
                        formikBag.setStatus('Wrong password');
                      }
                      if (errorCode == 'auth/user-not-found') {
                        formikBag.setStatus('Wrong email/username');
                      }
                      if (errorCode == 'auth/too-many-requests') {
                        formikBag.setStatus('Too many signin attempts. Try again later');
                      } else if (error) {
                        formikBag.setStatus('Error: Sign in unsuccessful');
                      }
                    });
                }, 2000);
              }}
            >
              {({ status }) => (
                <Form class='flex flex-col'>
                  <div class='mb-[1rem] flex flex-col'>
                    <label class='mb-[0.5rem] font-bold ' htmlFor='password'>
                      Email
                    </label>
                    <Field class='mb-[0.5rem] focus:ring-0 focus:outline-offset-8   border-1 border-neutral-400' name='email' type='email' />
                    <p class='text-red text-[12px]'>
                      <ErrorMessage name='email' />
                    </p>
                  </div>

                  <div class='mb-[1rem] flex flex-col'>
                    <label class='mb-[0.5rem] font-bold' htmlFor='email'>
                      Password
                    </label>
                    <Field class='mb-[0.5rem] border-1 focus:ring-0 border-neutral-400' name='password' type='password' />
                    <p class='text-red text-[12px]'>
                      <ErrorMessage name='password' />
                      {status}
                    </p>
                  </div>

                  <button class='bg-red text-white p-[1rem] font-bold rounded-xl mt-[1rem] hover:bg-black' type='submit'>
                    {loadingSpinner}
                  </button>
                </Form>
              )}
            </Formik>
          </div>

          <div class='mt-6 w-[30%]'>
            <p class='mt-2 text-center text-sm text-neutral-900 cursor-pointer'>
              Not a member?
              <Link to='/signup'>
                <b>Create An Account</b>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
