import { useEffect, useState, createContext, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, onSnapshot, doc, query, where, collection } from '@firebase/firestore';
import { getStorage, ref } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import _ from 'lodash';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);

export function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}

export const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState();
  const [userProfile, setUserProfile] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState();
  const [pins, setPins] = useState();
  const [boards, setBoards] = useState();
  const [boardsCount, setBoardsCount] = useState();
  const [pinsCount, setPinsCount] = useState();
  const [userBoards, setUserBoards] = useState();
  const [userPins, setUserPins] = useState();
  const [userSavedPins, setUserSavedPins] = useState();
  const [userFollowers, setUserFollowers] = useState();
  const [userFollowing, setUserFollowing] = useState();
  const [userSearches, setUserSearches] = useState();

  useEffect(() => {
    setLoading(true);
    console.log('user signing in...');

    onAuthStateChanged(auth, (res) => {
      if (res) {
        setUser(res);
        setLoading(false);
        console.log('user signed in');
        console.log(res);
      } else {
        console.log('user not signed in');
      }

      const contentCollectionRef = collection(db, 'content');
      const usersCollectionRef = collection(db, 'public_users');
      const userFollowingRef = collection(db, 'public_users', `${res?.uid}`, 'following');

      const userFollowersRef = collection(db, 'public_users', `${res?.uid}`, 'followers');

      const userSavedContentRef = collection(db, 'public_users', `${res?.uid}`, 'saved_pins');
      const userSearchedContentRef = collection(db, 'public_users', `${res?.uid}`, 'searches');

      const q_user = query(usersCollectionRef, where('uid', '==', `${res?.uid}`));
      const q_user_boards = query(contentCollectionRef, where('author', '==', `${res?.uid}`), where('type', '==', 'board'));
      const q_user_pins = query(contentCollectionRef, where('author', '==', `${res?.uid}`), where('type', '==', 'pin'));

      const q_user_following = query(userFollowingRef, where('type', '==', 'following'));

      const q_user_followers = query(userFollowersRef, where('type', '==', 'followers'));

      const q_user_saved_pins = query(userSavedContentRef, where('saved', '==', true));

      const q_pins = query(contentCollectionRef, where('type', '==', 'pin'));
      const q_boards = query(contentCollectionRef, where('type', '==', 'board'));
      const q_searches = query(userSearchedContentRef, where('type', '==', 'search'));

      /* Users & Profiles */

      onSnapshot(usersCollectionRef, (doc) => {
        const users_data = [];
        doc.docs.forEach((doc) => {
          users_data.push(doc.data());
        });
        // console.log(users_data);
        setUsers(users_data);
      });

      /* Current Profile */

      onSnapshot(q_user, (querySnapshot) => {
        const user_profile = [];
        querySnapshot.docs.forEach((doc) => {
          user_profile.push(doc.data());
        });
        setUserProfile(user_profile);
      });

      onSnapshot(q_user_following, (querySnapshot) => {
        const user_following = [];
        querySnapshot.docs.forEach((doc) => {
          user_following.push(doc.data());
        });
        console.log(user_following.filter((usrs) => usrs.type === 'following'));
        setUserFollowing(user_following.filter((usrs) => usrs.type === 'following'));
      });

      onSnapshot(q_user_followers, (querySnapshot) => {
        const user_followers = [];
        querySnapshot.docs.forEach((doc) => {
          user_followers.push(doc.data());
        });
        console.log(user_followers);
        setUserFollowers(user_followers);
      });

      /* All Boards */

      onSnapshot(q_boards, (querySnapshot) => {
        const boards_content = [];
        querySnapshot.docs.forEach((doc) => {
          boards_content.push(doc.data());
        });
        // console.log(boards_content);
        setBoards(boards_content);
      });

      /* Current User's Pins and Boards */

      onSnapshot(q_user_boards, (querySnapshot) => {
        const user_content = [];
        querySnapshot?.docs?.forEach((doc) => {
          user_content?.push(doc?.data());
        });
        const assignProp = user_content.map(function (board, i) {
          return Object.assign(board, { hover: false });
        });
        setUserBoards(assignProp);
      });

      onSnapshot(q_user_pins, (querySnapshot) => {
        const user_content = [];
        querySnapshot?.docs?.forEach((doc) => {
          user_content?.push(doc?.data());
        });
        // console.log(user_content);
        setUserPins(user_content);
      });

      onSnapshot(q_user_saved_pins, (querySnapshot) => {
        const user_saved_pins = [];
        querySnapshot.docs.forEach((doc) => {
          user_saved_pins.push(doc.data());
        });
        console.log(user_saved_pins);
        setUserSavedPins(user_saved_pins);
      });

      onSnapshot(q_searches, (querySnapshot) => {
        const user_searches = [];
        querySnapshot.docs.forEach((doc) => {
          user_searches.push(doc.data());
        });
        console.log(user_searches);
        setUserSearches(user_searches);
      });

      /* Global Content */

      onSnapshot(q_pins, (querySnapshot) => {
        const pins_content = [];
        querySnapshot?.docs?.forEach((doc) => {
          pins_content?.push(doc?.data());
        });
        // console.log(pins_content);
        setPins(pins_content);
      });
    });

    console.log(loading);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        boards,
        boardsCount,
        content,
        error,
        loading,
        pins,
        pinsCount,
        user,
        userBoards,
        userFollowers,
        userFollowing,
        userPins,
        userProfile,
        users,
        userSavedPins,
        userSearches,
      }}
      {...props}
    />
  );
};

export const useAuthState = () => {
  const auth = useContext(AuthContext);
  return {
    ...auth,
    isAuthenticated: auth?.user != null,
    isLoaded: auth?.user != null,
  };
};
