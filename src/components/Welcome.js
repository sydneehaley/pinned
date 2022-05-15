import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { createAccount, toggleSignIn, signUpUser, signInAuthUser } from '../store/features/appState';
import CircleIcon from '@mui/icons-material/Circle';
import { useAuthState } from '../firebase/config';

const Welcome = () => {
  const { isAuthenticated } = useAuthState();
  const { user } = useAuthState();
  const { isLoaded } = useAuthState();
  console.log(isAuthenticated);
  console.log(user);
  console.log(isLoaded);
  let navigate = useNavigate();
  let location = useLocation();

  let from = location.state?.from?.pathname || '/';

  const dispatch = useDispatch();
  const getState = useSelector((state) => state.pingallery);

  console.log(getState);

  const [createUser, setCreateUser] = useState({
    id: '',
    email: '',
    // username: '',
    password: '',
  });
  const toggleSignInForm = useSelector((state) => state.pingallery.wantsSignIn);

  const handleOnChange = (e) => {
    e.preventDefault();
    setCreateUser({
      ...createUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    dispatch(signUpUser(createUser));
    dispatch(createAccount());
    navigate(from, { replace: true });
    // dispatch(getAuthUserData());}
  };
  const handleLoginToggle = () => {
    dispatch(toggleSignIn());
  };

  return (
    <div className='account'>
      <div className='account__container'>
        {toggleSignInForm === false ? (
          <div class='min-h-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
            <div class='max-w-md w-full space-y-8'>
              <div>
                <div class='flex flex-col justify-center items-center text-red text-6xl'>
                  <CircleIcon />
                </div>
                <h2 class='mt-6 text-center text-3xl font-extrabold text-gray-900'>Welcome to Pinned</h2>
                <p class='mt-2 text-center text-sm text-gray-600'>Post your ideas</p>
              </div>
              <form class='mt-8 space-y-6' action='#' method='POST' onSubmit={handleOnSubmit}>
                <input type='hidden' name='remember' value='true' />
                <div class='rounded-md shadow-sm -space-y-px'>
                  <div>
                    <label for='email-address' class='sr-only'>
                      Email address
                    </label>
                    <input
                      id='email-address'
                      name='email'
                      type='email'
                      value={createUser.email}
                      onChange={handleOnChange}
                      autocomplete='email'
                      required
                      class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red focus:border-red focus:z-10 sm:text-sm'
                      placeholder='Email address'
                    />
                  </div>
                  <div>
                    <label for='password' class='sr-only'>
                      Password
                    </label>
                    <input
                      id='password'
                      name='password'
                      type='password'
                      value={createUser.password}
                      onChange={handleOnChange}
                      autocomplete='current-password'
                      required
                      class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red focus:border-red focus:z-10 sm:text-sm'
                      placeholder='Password'
                    />
                  </div>
                  <div>
                    <label for='password' class='sr-only'>
                      Verify Password
                    </label>
                    <input
                      id='vpassword'
                      name='vpassword'
                      type='password'
                      value={createUser.password}
                      onChange={handleOnChange}
                      autocomplete='current-password'
                      required
                      class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red focus:border-red focus:z-10 sm:text-sm'
                      placeholder='Verify Password'
                    />
                  </div>
                </div>

                <div class='flex items-center justify-between'>
                  <div class='flex items-center'>
                    <input
                      id='remember-me'
                      name='remember-me'
                      type='checkbox'
                      class='h-4 w-4 text-indigo-600 focus:ring-red border-gray-300 rounded'
                    />
                    <label for='remember-me' class='ml-2 block text-sm text-gray-900'>
                      {' '}
                      Remember me{' '}
                    </label>
                  </div>

                  <div class='text-sm'>
                    <a href='#' class='font-medium text-red hover:text-red'>
                      {' '}
                      Forgot your password?{' '}
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type='submit'
                    class='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    <span class='absolute left-0 inset-y-0 flex items-center pl-3'>
                      <svg
                        class='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='white'
                        aria-hidden='true'
                      >
                        <path
                          fill-rule='evenodd'
                          d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                          clip-rule='evenodd'
                        />
                      </svg>
                    </span>
                    Sign up
                  </button>
                </div>
              </form>
            </div>
            <div class='mt-6 ... w-1/4'>
              <p class='mt-2 text-center text-sm text-gray-600'>
                By continuing, you agree to our <b>Terms of Service</b> and acknowledge you've read our <b>Privacy Policy</b>
              </p>
              <p class='mt-2 text-center text-sm text-gray-600' onClick={handleLoginToggle}>
                Already a member? <b> Log in</b>
              </p>
            </div>
          </div>
        ) : (
          <SignIn />
        )}
      </div>
    </div>
  );
};

const SignIn = () => {
  const { user } = useAuthState();
  let navigate = useNavigate();
  let location = useLocation();

  let from = location.state?.from?.pathname || '/';
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.pingallery.errors);

  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
  });

  const [errorMsg, setErrorMsg] = useState();
  const { email, password } = userInput;

  const handleOnChange = (e) => {
    setUserInput((userInput) => ({
      ...userInput,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnClick = (e) => {
    e.preventDefault();
    const values = [email, password];

    const allFieldsFilled = values.every((field) => {
      const value = `${field}`.trim();
      return value !== '' && value !== '0';
    });

    if (allFieldsFilled) {
      dispatch(signInAuthUser(userInput));
      // navigate(from, { replace: true });
      navigate(from, { replace: true });
    } else {
      setErrorMsg('Please complete all fields');
    }
  };

  const handleCreateAccountToggle = () => {
    dispatch(toggleSignIn());
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
              <h2 class='mt-6 text-center text-3xl font-extrabold text-gray-900'>Welcome Back</h2>
              <p class='mt-2 text-center text-sm text-gray-600'>Sign into your account</p>
            </div>
            <form class='mt-8 space-y-6' action='#' method='POST' onSubmit={handleOnClick}>
              <input type='hidden' name='remember' value='true' />
              <div class='rounded-md shadow-sm -space-y-px'>
                <div>
                  <label for='email-address' class='sr-only'>
                    Email address
                  </label>
                  <input
                    id='email-address'
                    name='email'
                    type='email'
                    value={userInput.email}
                    onChange={handleOnChange}
                    autocomplete='email'
                    required
                    class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red focus:border-red focus:z-10 sm:text-sm'
                    placeholder='Email address'
                  />
                </div>
                <div>
                  <label for='password' class='sr-only'>
                    Password
                  </label>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    value={userInput.password}
                    onChange={handleOnChange}
                    autocomplete='current-password'
                    required
                    class='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red focus:border-red focus:z-10 sm:text-sm'
                    placeholder='Password'
                  />
                </div>
              </div>

              <div class='flex items-center justify-between'>
                <div class='flex items-center'>
                  <input id='remember-me' name='remember-me' type='checkbox' class='h-4 w-4 text-indigo-600 focus:ring-red border-gray-300 rounded' />
                  <label for='remember-me' class='ml-2 block text-sm text-gray-900'>
                    {' '}
                    Remember me{' '}
                  </label>
                </div>

                <div class='text-sm'>
                  <a href='#' class='font-medium text-red hover:text-red'>
                    {' '}
                    Forgot your password?{' '}
                  </a>
                </div>
              </div>

              <div>
                <button
                  type='submit'
                  class='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  <span class='absolute left-0 inset-y-0 flex items-center pl-3'>
                    <svg
                      class='h-5 w-5 text-indigo-500 group-hover:text-indigo-400'
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 20 20'
                      fill='white'
                      aria-hidden='true'
                    >
                      <path
                        fill-rule='evenodd'
                        d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                        clip-rule='evenodd'
                      />
                    </svg>
                  </span>
                  Sign in
                </button>
              </div>
            </form>
          </div>

          <div class='mt-6 ... w-1/4'>
            <p class='mt-2 text-center text-sm text-gray-600'>
              Not a member? <b onClick={handleCreateAccountToggle}>Create An Account</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;