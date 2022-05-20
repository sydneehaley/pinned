import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleSettingsSections } from '../store/features/appState';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, storage, useAuthState } from '../firebase/config';
import { updatePassword, updateEmail, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { css } from '@emotion/react';
import _ from 'lodash';
import Button from './UI/Button';

const Settings = () => {
  const toggleSections = useSelector((state) => state.pingallery.toggleSettings);
  const dispatch = useDispatch();

  return (
    <div class='w-full flex items-center justify-center'>
      <div class='w-[90%] flex mt-[2rem] mb-[7rem]'>
        <div class='w-[20%]'>
          <ul class='font-bold text-[1rem] cursor-pointer'>
            <li onClick={() => dispatch(toggleSettingsSections())}>Public profile</li>
            <li onClick={() => dispatch(toggleSettingsSections())}>Account</li>
          </ul>
        </div>
        <div class='w-[80%]'>{toggleSections === false ? <Profile /> : <Account />}</div>
      </div>
    </div>
  );
};

const Account = () => {
  const { user } = useAuthState();
  const [loader, setLoader] = useState(false);
  const [currAccount, setCurrAccount] = useState({
    email: user?.email,
    password: '',
    displayName: user?.displayName,
  });
  const [errorMsg, setErrorMsg] = useState({
    passwordMismatch: false,
    error: '',
  });
  const [successMsg, setSuccessMsg] = useState({
    success: false,
    message: '',
  });
  const { email, password, displayName } = currAccount;

  const [verified, setVerified] = useState({
    verifiedPassword: '',
  });
  const { verifiedPassword } = verified;

  useEffect(() => {
    const isLoading = () => {
      if (!loader) {
        setTimeout(() => {
          setLoader(false);
          console.log(loader);
        }, 3000);
      }
    };

    isLoading();
  }, []);

  const handleOnChange = (e) => {
    setCurrAccount((currAccount) => ({
      ...currAccount,
      [e.target.name]: e.target.value,
    }));
    setVerified((verified) => ({
      ...verified,
      [e.target.name]: e.target.value,
    }));
  };
  const handleOnChangeToggle = (e) => {
    setCurrAccount({ accountActive: false });
  };

  const newPassword = password;

  const createNewPassword = () =>
    updatePassword(user, newPassword)
      .then(() => {
        console.log('password changed');
      })
      .catch((error) => {
        console.log(error);
      });

  const updatedEmail = email;

  const updateUserEmail = () =>
    updateEmail(user, updatedEmail)
      .then(() => {
        console.log('email updated!');
      })
      .catch((error) => {
        console.log('error updating email');
      });

  const handleOnClick = (e) => {
    e.preventDefault();
    const passwordValue = password;
    const emailValue = email;

    const verifyPassword = passwordValue !== '' && verifiedPassword !== '';
    const verifyFields = password === verifiedPassword && emailValue !== '';
    if (verifyPassword && verifyFields) {
      createNewPassword();
      updateUserEmail();
      setSuccessMsg({
        success: true,
        message: 'Account successfully updated',
      });
      setErrorMsg({ ...errorMsg, error: null });
      console.log('account details updated');
      setLoader(true);
    } else {
      setErrorMsg({
        passwordMismatch: true,
        error: 'passwords must match',
      });
      setSuccessMsg({ ...successMsg, message: null });
      setLoader(true);
    }
    if (emailValue === '') {
      setErrorMsg({ error: 'All fields must be filled' });
    }
  };

  return (
    <div class='w-[50%]'>
      <div class='mb-[2rem]'>
        <h1 class='text-[2rem] font-bold'>My account</h1>
        <h5>Update your account details</h5>
      </div>
      <div>
        <p style={{ color: 'green' }}>{successMsg.message}</p>
      </div>
      <div class='flex flex-col mb-[2rem]'>
        <span class='text-[12px] mb-[0.5rem]'>Change Password</span>
        <input
          class='rounded-xl border-2 border-solid border-neutral-300'
          placeholder='Update your email address'
          type='email'
          value={currAccount.email}
          name='email'
          onChange={handleOnChange}
        ></input>
      </div>
      <div class='flex flex-col mb-[2rem]'>
        <span class='text-[12px] mb-[0.5rem]'>Change Password</span>
        <input
          class='rounded-xl border-2 border-solid border-neutral-300'
          placeholder='Update your password'
          type='password'
          value={currAccount.password}
          name='password'
          onChange={handleOnChange}
        ></input>
      </div>
      <div class='flex flex-col mb-[2rem]'>
        <span class='text-[12px] mb-[0.5rem]'>Verify Password</span>
        <input
          class='rounded-xl border-2 border-solid border-neutral-300'
          placeholder='Verify your new password'
          type='password'
          name='verifiedPassword'
          value={verifiedPassword.verified}
          onChange={handleOnChange}
        ></input>
        <div>
          <p style={{ color: 'red' }}>{errorMsg.error}</p>
        </div>
      </div>
      <div class='flex flex-col mb-[2rem]'>
        <span class='text-[12px] mb-[0.5rem]'>Deactivate Account</span>
        <label class='switch'>
          <input type='checkbox' onChange={handleOnChangeToggle} />
          <span class='slider round'></span>
        </label>
      </div>
      <div className='settings__right__container__inputrow--button'>
        <Button
          background={'bg-neutral-200'}
          hover={'hover:bg-red hover:text-white'}
          onClickAction={handleOnClick}
          classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 mt-[1rem]'}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, userProfile } = useAuthState();
  let [color, setColor] = useState('#767676');

  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
  const [profile, setProfile] = useState();

  const [image, setImage] = useState();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setProfile(userProfile[0]);

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

    const isLoading = () => {
      setTimeout(() => {
        setLoader(false);
        console.log(loader);
      }, 3000);
    };

    isLoading();
  }, [image]);

  console.log(profile?.displayName);

  const handleOnChange = (e) => {
    setProfile((profile) => ({
      ...profile,
      [e.target.name]: e.target.value,
    }));
  };

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
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
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

  const updateUserProfile = async () => {
    const userRef = doc(db, 'public_users', `${user?.uid}`);
    await updateDoc(userRef, { ...profile });
  };

  const updateAuthDisplayName = () => {
    updateProfile(user, {
      displayName: profile?.username,
    });
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    updateUserProfile();
    updateAuthDisplayName();
    console.log('profile updated');
  };

  return (
    <div class='w-[50%]'>
      <div>
        <div class='mb-[2rem]'>
          <h1 class='text-[2rem] font-bold'>Public profile</h1>
          <h5 class='text-black font-regular'>People visiting your profile will see the following info</h5>
        </div>
        <div class='mb-[2rem]'>
          <span class='text-[12px] mb-[2rem]'>Photo</span>
          <div class='flex items-center mt-[1rem]'>
            <input hidden id='uploadImg' type='file' accept='image/*' onChange={onFileChange} />{' '}
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
          <input
            class='rounded-xl border-2 border-solid border-neutral-300'
            type='text'
            name='name'
            value={profile?.name || ''}
            onChange={handleOnChange}
          ></input>
        </div>
        <div class='flex flex-col mb-[2rem]'>
          <span class='text-[12px] mb-[0.5rem]'>Tagline</span>
          <input
            class='rounded-xl border-2 border-solid border-neutral-300'
            placeholder='A short blurb about yourself'
            name='tagline'
            type='text'
            value={profile?.tagline || ''}
            onChange={handleOnChange}
          ></input>
        </div>
        <div class='flex flex-col mb-[2rem]'>
          <span class='text-[12px] mb-[0.5rem]'>Username</span>
          <input
            class='rounded-xl border-2 border-solid border-neutral-300'
            placeholder='Update your username'
            name='username'
            type='text'
            value={profile?.displayName || ''}
            onChange={handleOnChange}
          ></input>
        </div>
        <div class='flex flex-col mb-[2rem]'>
          <span class='text-[12px] mb-[0.5rem]'>Website</span>
          <input
            class='rounded-xl border-2 border-solid border-neutral-300'
            placeholder='Add a link to drive traffic to your site'
            name='website'
            type='text'
            value={profile?.website || ''}
            onChange={handleOnChange}
          ></input>
        </div>

        <div>
          <Button
            background={'bg-neutral-200'}
            hover={'hover:bg-red hover:text-white'}
            onClickAction={handleOnClick}
            classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 mt-[1rem]'}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
