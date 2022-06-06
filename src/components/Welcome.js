import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { db, signup } from '../firebase/config';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import CircleIcon from '@mui/icons-material/Circle';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const Welcome = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const [loading, setLoading] = useState(true);
  const [loadingSpinner, setLoadingSpinner] = useState('Create Account');
  const [passwordReqs, setPasswordReqs] = useState(false);

  const signUpNewUser = async (values) => {
    try {
      const { user } = await signup(values.email, values.verifyPassword);
      await setDoc(doc(db, 'public_users', `${user?.uid}`), {
        created: Timestamp.now(),
        displayName: '',
        header_image: '',
        name: '',
        photoURL: '',
        tagline: '',
        uid: user?.uid,
        website: '',
      });

      await setDoc(doc(db, 'public_users', `${user?.uid}`, 'currSearchQuery', 'query'), { active: true });
      await setDoc(doc(db, 'public_users', `${user?.uid}`, 'followers', 'active'), { active: true });
      await setDoc(doc(db, 'public_users', `${user?.uid}`, 'following', 'active'), { active: true });
      await setDoc(doc(db, 'public_users', `${user?.uid}`, 'saved_pins', 'active'), { active: true });
      await setDoc(doc(db, 'public_users', `${user?.uid}`, 'searches', 'active'), { active: true });

      return user;
    } catch (error) {
      console.log('error', error);
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = 'Email Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
      errors.email = 'Invalid email address';
    }

    if (!values.password) {
      setPasswordReqs(false);
      errors.password = 'Password Required';
    } else if (!/^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/.test(values.password)) {
      setPasswordReqs(true);
      errors.password = 'Password must contain';
    }

    // This regex can be used to restrict passwords to a length of 8 to 20 alphanumeric characters and select special characters. The password also can not start with a digit, underscore or special character and must contain at least one digit.

    if (!values.verifyPassword) {
      errors.verifyPassword = 'Please verify password';
    } else if (values.verifyPassword !== values.password) {
      errors.verifyPassword = 'Passwords must match';
    }

    return errors;
  };

  return (
    <div className='account'>
      <div className='account__container'>
        <div class='min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
          <div class='max-w-md w-full space-y-8'>
            <div>
              <div class='flex flex-col justify-center items-center text-red text-6xl'>
                <CircleIcon />
              </div>
              <h2 class='mt-6 text-center text-3xl font-extrabold text-neutral-900'>Welcome to Pinned</h2>
              <p class='mt-2 text-center text-sm text-neutral-600'>Share your ideas</p>
            </div>

            <Formik
              initialValues={{ email: '', password: '', verifyPassword: '' }}
              validate={validate}
              onSubmit={(values, formikBag) => {
                setLoadingSpinner('Signing In....');
                setTimeout(() => {
                  // alert(JSON.stringify(values, null, 2));
                  setLoadingSpinner('Sign In');
                  setLoading(false);
                  formikBag.setSubmitting(false);
                  signUpNewUser(values);
                  console.log(formikBag.isValidating);
                  if (location.state?.from?.pathname == '/signup' && loading === false) {
                    let from = '/';
                    navigate(from, { replace: true });
                  } else if (loading === false) {
                    let from = location.state?.from?.pathname || '/';
                    navigate(from, { replace: true });
                  }
                }, 2000);
              }}
            >
              {({ errors, touched }) => (
                <Form class='flex flex-col'>
                  <div class='mb-[1rem] flex flex-col'>
                    <label class='mb-[0.5rem] font-bold ' htmlFor='email'>
                      Email
                    </label>
                    <Field class='mb-[0.5rem] focus:ring-0 focus:outline-offset-8   border-1 border-neutral-400' name='email' type='email' />
                    <div class='text-red text-[12px]'>
                      <ErrorMessage name='email' />
                    </div>
                  </div>

                  <div class='mb-[1rem] flex flex-col'>
                    <label class='mb-[0.5rem] font-bold ' htmlFor='email'>
                      Password
                    </label>
                    <Field class='mb-[0.5rem] focus:ring-0 focus:outline-offset-8   border-1 border-neutral-400' name='password' type='text' />
                    <div class='text-red text-[12px]'>
                      {errors.password && touched.password ? (
                        <div>
                          {passwordReqs === true ? (
                            <span>
                              {errors.password} <br />
                              <br />
                              <ul class='list-disc text-neutral-900 list-inside'>
                                <li>8-20 characters</li>
                                <li>Cannot start with a number</li>
                                <li>An uppercase character</li>
                                <li>A number</li>
                              </ul>
                            </span>
                          ) : (
                            <p>{errors.password}</p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div class='mb-[1rem] flex flex-col'>
                    <label class='mb-[0.5rem] font-bold ' htmlFor='email'>
                      Verify Password
                    </label>
                    <Field class='mb-[0.5rem] focus:ring-0 focus:outline-offset-8   border-1 border-neutral-400' name='verifyPassword' type='text' />
                    <div class='text-red text-[12px]'>
                      <ErrorMessage name='verifyPassword' />
                    </div>
                  </div>
                  <button class='bg-red text-white p-[1rem] font-bold rounded-xl mt-[1rem] hover:bg-black' type='submit'>
                    {loadingSpinner}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
          <div class='mt-6 ... w-1/4 text-neutral-600'>
            <p class='mt-2 text-center text-sm'>
              By continuing, you agree to our <b>Terms of Service</b> and acknowledge you've read our <b>Privacy Policy</b>
            </p>
            <p class='mt-2 text-center text-sm cursor-pointer'>
              Already a member?{' '}
              <Link to='/signin'>
                <b> Log in</b>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
