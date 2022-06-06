import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db, storage, useAuthState } from '../firebase/config';
import { updatePassword, updateEmail, updateProfile, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import _ from 'lodash';
import Button from './UI/Button';
import Modal from './UI/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';

const Settings = () => {
  const { userProfile } = useAuthState();
  const [toggleSection, setToggleSection] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (userProfile !== null) {
        setLoading(false);
        console.log('user profile loaded');
      }
    }, 1000);
  }, []);

  const handleSectionToggle = () => {
    setToggleSection(!toggleSection);
  };

  return (
    <div>
      {loading === true ? (
        <div></div>
      ) : (
        <div class='w-full flex items-center justify-center'>
          <div class='w-[90%] flex mt-[2rem] mb-[7rem]'>
            <div class='w-[20%]'>
              <ul class='font-bold text-[1rem] cursor-pointer'>
                <li onClick={handleSectionToggle}>Public profile</li>
                <li onClick={handleSectionToggle}>Account</li>
              </ul>
            </div>
            <div class='w-[80%]'>{toggleSection === false ? <Profile profileData={userProfile[0]} /> : <Account />}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const Account = () => {
  const [loadingSpinner, setLoadingSpinner] = useState('Save');
  const [passwordReqs, setPasswordReqs] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [error, setError] = useState(false);
  const [password, setPassword] = useState('');

  const createNewPassword = (values) => {
    return updatePassword(auth.currentUser, values?.password);
  };

  const updateUserEmail = (values) => {
    return updateEmail(auth.currentUser, values?.email);
  };

  const validateAccount = (values) => {
    const errors = {};

    if (values.email !== '') {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
    }

    if (values.password !== '') {
      if (!/^(?=[^\d_].*?\d)\w(\w|[!@#$%]){7,20}/.test(values.password)) {
        setPasswordReqs(true);
        errors.password = 'Password must contain';
      }

      if (!values.verifyPassword) {
        errors.verifyPassword = 'Please verify password';
      } else if (values.verifyPassword !== values.password) {
        errors.verifyPassword = 'Passwords must match';
      }
    }

    return errors;
  };

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  const credential = EmailAuthProvider.credential(auth.currentUser.email, password);

  const reauthenticateUser = async () => {
    await reauthenticateWithCredential(auth.currentUser, credential).then(console.log('user loggedbback in'));
  };

  const handleLogin = () => {
    reauthenticateUser();
    closeModal();
  };

  return (
    <div class='w-[50%] box-border'>
      <div class='mb-[2rem]'>
        <h1 class='text-[2rem] font-bold'>My account</h1>
        <h5>Update your account details</h5>
      </div>
      <div>{/* <p style={{ color: 'green' }}>{successMsg.message}</p> */}</div>
      <Formik
        initialValues={{ email: '', password: '', verifyPassword: '' }}
        validate={validateAccount}
        onSubmit={(values, formikBag) => {
          setLoadingSpinner('Updating....');
          setTimeout(() => {
            // alert(JSON.stringify(values, null, 2));
            if (values.verifyPassword !== '') {
              createNewPassword(values)
                .then(() => {
                  console.log('Password updated');
                  formikBag.setStatus('Password updated!');
                  setTimeout(() => {
                    formikBag.setStatus(null);
                    setLoadingSpinner('Save');
                  }, 2000);
                  formikBag.resetForm({
                    values: {
                      password: '',
                      verifyPassword: '',
                    },
                  });
                })
                .catch((error) => {
                  setError(true);
                  formikBag.setStatus(error.message);
                  setLoadingSpinner('Save');
                  setTimeout(() => {
                    formikBag.setStatus(null);
                  }, 2000);
                  if (error.code == 'auth/requires-recent-login') {
                    openModal();
                  }
                });
            }

            if (values.email !== '') {
              updateUserEmail(values)
                .then(() => {
                  console.log('Email updated');
                  formikBag.setStatus('Email updated!');
                  setTimeout(() => {
                    formikBag.setStatus(null);
                    setLoadingSpinner('Save');
                  }, 2000);
                  formikBag.resetForm({
                    values: {
                      email: '',
                    },
                  });
                })
                .catch((error) => {
                  setError(true);
                  formikBag.setStatus(error.message);
                  setTimeout(() => {
                    formikBag.setStatus(null);
                    setLoadingSpinner('Save');
                  }, 2000);
                  if (error.code == 'auth/requires-recent-login') {
                    openModal();
                  }
                });
            }
            formikBag.setSubmitting(false);
          }, 2000);
        }}
      >
        {({ errors, touched, status }) => (
          <Form class='flex flex-col'>
            <div class='flex flex-col mb-[2rem]'>
              {status && (
                <div
                  class={`${error === true ? 'bg-pink-100' : 'bg-emerald-100'} box-border flex items-center h-[3rem] ${
                    error === true ? 'border-red' : 'border-emerald-600'
                  } border rounded-md mb-[2rem]`}
                >
                  <p class={`text-[12px] ${error === true ? 'text-red' : 'text-emerald-600'} ml-[0.5rem]`}>{status}</p>
                </div>
              )}
              <label class='text-[12px] mb-[0.5rem]'>Change Email</label>
              <Field class='rounded-xl border-2 border-solid border-neutral-300' placeholder='Update your email address' name='email' type='email' />
              <p class='text-red text-[12px] mt-[0.5rem]'>
                <ErrorMessage name='email' />
              </p>
            </div>
            <div class='flex flex-col mb-[2rem]'>
              <label class='text-[12px] mb-[0.5rem]'>Change Password</label>
              <Field class='rounded-xl border-2 border-solid border-neutral-300' placeholder='Update your password' name='password' type='password' />
              <div class='text-red text-[12px] mt-[0.5rem]'>
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
            <div class='flex flex-col mb-[2rem]'>
              <label class='text-[12px] mb-[0.5rem]'>Verify Password</label>
              <Field
                class='rounded-xl border-2 border-solid border-neutral-300'
                name='verifyPassword'
                placeholder='Verify your password'
                type='password'
              />
              <p class='text-red text-[12px] mt-[0.5rem]'>
                <ErrorMessage name='verifyPassword' />
              </p>
            </div>

            {/* <div class='flex flex-col mb-[2rem]'>
              <span class='text-[12px] mb-[0.5rem]'>Deactivate Account</span>
              <label class='switch'>
                <input type='checkbox' onChange={handleOnChangeToggle} />
                <span class='slider round'></span>
              </label>
            </div> */}
            <div className='settings__right__container__inputrow--button'>
              <Button
                background={'bg-neutral-200'}
                hover={'hover:bg-red hover:text-white'}
                classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 mt-[1rem]'}
                type='submit'
              >
                {loadingSpinner}
              </Button>
            </div>
          </Form>
        )}
      </Formik>

      <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Password Required'} modalHeight={'h-[30vh]'}>
        {/* <input type='text' placeholder='Enter your email address' /> */}
        <div class='flex flex-col'>
          <input
            class='rounded-xl border-2 border-solid border-neutral-300'
            type='password'
            value={password}
            placeholder='Enter your password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            background={'bg-neutral-200'}
            hover={'hover:bg-red hover:text-white'}
            classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 mt-[1rem]'}
            type='submit'
            onClickAction={handleLogin}
          >
            Sign In
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const Profile = ({ profileData }) => {
  const { user } = useAuthState();
  const [profile, setProfile] = useState();
  const [image, setImage] = useState();
  const [loadingButton, setLoadingButton] = useState('Save');
  const [error, setError] = useState(false);

  useEffect(() => {
    setProfile(profileData);

    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          profile_image: reader.result,
        });
      };
      reader.readAsDataURL(image);
    } else {
      setImage(null);
    }
  }, [image]);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file.size < 2e6 && file && file.type.substr(0, 5) === 'image') {
      setImage(file);
      // setLoader(true);
    } else {
      alert('File size is too big');
    }
    const metadata = {
      contentType: 'image/jpeg',
    };
    const storageRef = ref(storage, `${user?.uid}/profileimage/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          updateProfile(user, { photoURL: downloadURL });
          setProfile({
            ...profile,
            photoURL: downloadURL,
          });
        });
      }
    );
  };

  const updateUserProfile = async (values) => {
    const userRef = doc(db, 'public_users', `${user?.uid}`);
    await updateDoc(userRef, {
      displayName: values?.username,
      name: values?.name,
      tagline: values?.tagline,
      website: values?.website,
    });
  };

  const updateAuthDisplayName = (values) => {
    updateProfile(user, {
      displayName: values?.username,
    });
  };

  return (
    <div class='w-[50%]'>
      <div>
        <div class='mb-[2rem]'>
          <h1 class='text-[2rem] font-bold'>Public profile</h1>
          <h5 class='text-black font-regular'>People visiting your profile will see the following info</h5>
        </div>

        <Formik
          initialValues={{
            name: `${profileData?.name}`,
            username: `${profileData?.displayName}`,
            tagline: `${profileData?.tagline}`,
            website: `${profileData?.website}`,
          }}
          onSubmit={(values, formikBag) => {
            setLoadingButton('Updating...');
            updateUserProfile(values)
              .then(() => {
                console.log('Successfully updated profile');
                formikBag.setStatus('Profile Updated!');
                setTimeout(() => {
                  formikBag.setStatus(null);
                  setLoadingButton('Save');
                }, 2000);
              })
              .catch((error) => {
                setError(true);
                console.log(error);
                formikBag.setStatus(error);
                setTimeout(() => {
                  formikBag.setStatus(null);
                  setLoadingButton('Save');
                }, 2000);
              });
            if (values.displayName !== '') {
              updateAuthDisplayName(values)
                .then(() => {
                  console.log('Successfully updated user display name');
                  formikBag.setStatus(error);
                  setTimeout(() => {
                    formikBag.setStatus(null);
                    setLoadingButton('Save');
                  }, 2000);
                })
                .catch((error) => {
                  console.log(error);
                  setTimeout(() => {
                    formikBag.setStatus(null);
                    setLoadingButton('Save');
                  }, 2000);
                });
            }
            formikBag.setSubmitting(false);
          }}
        >
          {({ errors, touched, status }) => (
            <Form>
              <div>
                {status && (
                  <div
                    class={`${error === true ? 'bg-pink-100' : 'bg-emerald-100'} box-border flex items-center h-[3rem] ${
                      error === true ? 'border-red' : 'border-emerald-600'
                    } border rounded-md mb-[2rem]`}
                  >
                    <p class={`text-[12px] ${error === true ? 'text-red' : 'text-emerald-600'} ml-[0.5rem]`}>{status}</p>
                  </div>
                )}
              </div>
              <div class='mb-[2rem]'>
                <span class='text-[12px] mb-[2rem]'>Photo</span>
                <div class='flex items-center mt-[1rem]'>
                  <input hidden id='uploadImg' type='file' accept='image/*' onChange={onFileChange} />
                  <div class='flex '>
                    {profile?.photoURL === '' ? (
                      <div class='rounded-full font-bold text-[1.5rem] rounded-full outline outline-1 outline-neutral-400 outline-offset-2 text-neutral-900 bg-neutral-200  object-cover w-[70px] h-[70px] flex items-center justify-center'>
                        U
                      </div>
                    ) : (
                      <div>
                        <img
                          class='rounded-full border border-solid border-input_gray p-[3px] object-cover w-[70px] h-[70px]'
                          src={profile?.photoURL}
                          alt='profile_image'
                        />
                      </div>
                    )}
                  </div>
                  <label for='uploadImg'>
                    <p
                      class={`bg-neutral-200 py-[12px] px-[1rem] min-h-[48px] min-w-[60px] tracking-normal rounded-full font-bold ml-[1rem] hover:bg-red hover:text-white cursor-pointer`}
                    >
                      Change
                    </p>
                  </label>
                </div>
              </div>

              <div class='flex flex-col mb-[2rem]'>
                <span class='text-[12px] mb-[0.5rem]'>Name</span>
                <Field class='rounded-xl border-2 border-solid border-neutral-300' type='text' name='name' />
              </div>

              <div class='flex flex-col mb-[2rem]'>
                <span class='text-[12px] mb-[0.5rem]'>Tagline</span>
                <Field
                  class='rounded-xl border-2 border-solid border-neutral-300'
                  placeholder='A short blurb about yourself'
                  name='tagline'
                  type='text'
                />
              </div>

              <div class='flex flex-col mb-[2rem]'>
                <span class='text-[12px] mb-[0.5rem]'>Username</span>
                <Field class='rounded-xl border-2 border-solid border-neutral-300' placeholder='Update your username' name='username' type='text' />
              </div>

              <div class='flex flex-col mb-[2rem]'>
                <span class='text-[12px] mb-[0.5rem]'>Website</span>
                <Field
                  class='rounded-xl border-2 border-solid border-neutral-300'
                  placeholder='Add a link to drive traffic to your site'
                  type='text'
                  name='website'
                />
              </div>

              <div>
                <Button
                  background={'bg-neutral-200'}
                  hover={'hover:bg-red hover:text-white'}
                  classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 mt-[1rem]'}
                  type={'submit'}
                >
                  {loadingButton}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Settings;
