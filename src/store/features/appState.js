import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signup, login, logout } from '../../firebase/config';
import { db } from '../../firebase/config';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import _ from 'lodash';

const initialState = {
  user: {},
  users: [],
  visibleModal: false,
  wantsCreateAccount: true,
  wantsSignIn: false,
  isSignedIn: false,
  toggleSettings: false,
  searchParams: '',
  boardSelection: '',
  backgroundLocation: [],
  searchActive: false,
};

export const signUpUser = createAsyncThunk('pingallery/signupUser', async (createUser) => {
  try {
    const { user } = await signup(createUser.email, createUser.password);

    await setDoc(doc(db, 'users', `${user?.uid}`, 'content', 'profile'), {
      tagline: '',
      header_image: '',
      profile_image: '',
      tagline: '',
      username: '',
      website: '',
      name: '',
    });

    await setDoc(doc(db, 'users', `${user?.uid}`, 'content', 'content'), { active: true, boards: 0, likes: 0, pins: 0 });
    await setDoc(doc(db, 'users', `${user?.uid}`, 'content', 'following'), { active: true, following: 0 });
    await setDoc(doc(db, 'users', `${user?.uid}`, 'content', 'followers'), { active: true, followers: 0 });
    const usersRef = doc(db, 'public_users', 'users_list');
    await updateDoc(usersRef, {
      [user?.uid]: {
        uid: user?.uid,
        displayName: `user-${user?.uid}`,
      },
    });

    console.log(user);
    return user;
  } catch (error) {
    console.log('error', error);
  }
});

export const signInAuthUser = createAsyncThunk('pingallery/signInAuthUser', async (userInput) => {
  try {
    const { user } = await login(userInput.email, userInput.password);
    console.log(user);
    return user;
  } catch (error) {
    console.log('error', error);
  }
});

export const signOutAuthUser = createAsyncThunk('pingallery/signOutAuthUser', async () => {
  try {
    await logout();
  } catch (error) {
    console.log('error', error);
  }
});

export const appState = createSlice({
  name: 'pingallery',
  initialState,
  reducers: {
    createAccount: (state, action) => {
      state.wantsCreateAccount = !state.wantsCreateAccount;
      // state.currUser.push(action.payload.id);
      // state.users.push(action.payload);
      // state.isSignedIn = !state.isSignedIn;
    },
    toggleSignIn: (state, action) => {
      state.wantsSignIn = !state.wantsSignIn;
    },
    signInUser: (state, action) => {
      state.users.map((user) => {
        if (user.email === action.payload.email && user.password === action.payload.password) {
          state.isSignedIn = !state.isSignedIn;
          state.currUser.push(user.id);
        } else {
          state.errors = 'wrong email or password';
        }
      });
    },
    signOutUser: (state, action) => {
      // state.users.filter((user) => user.id === action.payload.id)[0].isSignedIn = !state.users.filter((user) => user.id === action.payload.id)[0]
      //   .isSignedIn;
      state.isSignedIn = !state.isSignedIn;
      state.currUser = [];
    },
    toggleDeletePinModal: (state, action) => {
      state.visibleModal = !state.visibleModal;
    },
    toggleSettingsSections: (state, action) => {
      state.toggleSettings = !state.toggleSettings;
    },
    getSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
    getBoardSelection: (state, action) => {
      state.boardSelection = action.payload;
    },
    getBackground: (state, action) => {
      state.backgroundLocation = action.payload;
    },
    setSearchActive: (state, action) => {
      state.searchActive = action.payload;
    },
  },
  extraReducers: {
    [signUpUser.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [signUpUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.currUser = action.payload?.uid;
      state.user = action.payload;
    },
    [signUpUser.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },

    [signOutAuthUser.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [signOutAuthUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.currUser = null;
      state.user = null;
    },
    [signOutAuthUser.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
    [signInAuthUser.pending]: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    [signInAuthUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [signInAuthUser.rejected]: (state, action) => {
      state.error = action.error.message;
      state.loading = false;
    },
  },
});

export const {
  createAccount,
  toggleSignIn,
  signInUser,
  signOutUser,
  toggleDeletePinModal,
  toggleSettingsSections,
  getSearchParams,
  getBoardSelection,
  getBackground,
  setSearchActive,
} = appState.actions;

export default appState.reducer;
