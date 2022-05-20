import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, useAuthState } from '../firebase/config';
import _ from 'lodash';
import Button from './UI/Button';
import Modal from './UI/Modal';

import Pin from './UI/Pin';
import PinList from './UI/PinList';
import MultiplePinsIcon from './UI/Icons/MultiplePinsIcons';
import ProfileHeader from './UI/ProfileHeader';
import UserProfileBoards from './UI/UserProfileBoards';

const PublicUserProfile = (props) => {
  //location path values
  const location = useLocation();
  const username = location.pathname.replace('/', '');

  //state values
  const { user, users, userFollowers, userFollowing } = useAuthState();
  const [id, setId] = useState();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [verifyFollowing, setVerifyFollowing] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [followers, setFollowers] = useState();
  const [following, setFollowing] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [followersCount, setFollowersCount] = useState();
  const [toggleModal, setToggleModal] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isCurrentUser, setCurrentUser] = useState(false);

  useEffect(() => {
    setLoading(true);
    // storing profile's user data to state
    const data = users?.filter((usr) => usr?.displayName === username);

    const profile_id = data[0]?.uid;

    if (users.length !== 0) {
      setId(profile_id);
      setProfile(data);
      console.log('data loaded');
      setLoading(false);
    } else {
      console.log('error loading data');
    }

    const userFollowingRef = collection(db, 'public_users', `${user?.uid}`, 'following');

    const q_user_following = query(userFollowingRef, where('type', '==', 'following'));

    onSnapshot(q_user_following, (querySnapshot) => {
      const user_following = [];
      querySnapshot.docs.forEach((doc) => {
        user_following.push(doc.data());
      });
      console.log(user_following);
      setFollowing(user_following);
      if (user_following.length <= 0) {
        setFollowingCount(0);
      } else {
        setFollowingCount(user_following.length);
      }
    });

    const userFollowersRef = collection(db, 'public_users', `${user?.uid}`, 'followers');
    const q_user_followers = query(userFollowersRef, where('type', '==', 'follower'));

    onSnapshot(q_user_followers, (querySnapshot) => {
      const user_followers = [];
      querySnapshot.docs.forEach((doc) => {
        user_followers.push(doc.data());
      });
      console.log(user_followers);
      setFollowers(user_followers);
      if (user_followers.length <= 0) {
        setFollowersCount(0);
      } else {
        setFollowersCount(user_followers.length);
      }
    });

    if (userFollowing.filter((usr) => usr.user === profile_id)) {
      setVerifyFollowing(true);
    }
  }, []);

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  const handleFollowers = () => {
    openModal();
    setShowFollowers(true);
    setShowFollowing(false);
  };

  const handleFollowing = () => {
    openModal();
    setShowFollowing(true);
    setShowFollowers(false);
  };

  return (
    <div class='w-full flex flex-col items-center mt-[4rem]'>
      {profile?.map((usr) => (
        <div class='w-[97%] flex flex-col'>
          <ProfileHeader
            followersCount={followersCount}
            followingCount={followingCount}
            handleFollowers={handleFollowers}
            handleFollowing={handleFollowing}
            isCurrentUser={isCurrentUser}
            usr={usr}
            verifyFollowing={verifyFollowing}
          />

          <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={showFollowers === true ? 'Followers' : 'Following'}>
            {showFollowers ? (
              <FollowersList id={id} followers={followers} users={users} />
            ) : showFollowing ? (
              <FollowingList id={id} following={following} users={users} />
            ) : null}
          </Modal>

          <div class='flex items-start w-full'>
            <UserContent user={user} id={id} />
          </div>
        </div>
      ))}
    </div>
  );
};

const FollowersList = ({ followers, users }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div class='w-full'>
      {followers?.length === 0 ? (
        <div>
          <p>No followers yet</p>
        </div>
      ) : (
        <div>
          {followers?.map((profile, i) => {
            return (
              <div class='w-full flex items-center justify-center h-[7rem]'>
                <div class='flex items-center leading-4 w-[90%]' key={i}>
                  <div>
                    <img
                      class='w-[50px] h-[50px] rounded-full'
                      src={users?.filter((usr) => usr?.uid === profile?.user).map((usr) => usr?.photoURL)}
                    />
                  </div>
                  <div class='font-bold ml-[10px]'>
                    <h6 class='font-bold'>{users?.filter((usr) => usr?.uid === profile?.user).map((usr) => usr?.name)}</h6>
                    {/* <span class='text-[12px] font-normal'>{users?.filter((usr) => usr?.uid === profile?.user).map((usr) => usr?.followers)} Followers</span> */}
                  </div>
                </div>
                <div>
                  <Button
                    background={'bg-lightest_gray'}
                    color={'text-black'}
                    hover={'hover:bg-black hover:text-white'}
                    classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0'}
                  >
                    Unfollow
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const FollowingList = ({ following, users }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div class='w-full'>
      {following?.length === 0 ? (
        <div>
          <p>Not following anyone yet</p>
        </div>
      ) : (
        <div>
          {following?.map((profile, i) => {
            return (
              <div class='w-full flex items-center justify-center h-[7rem]'>
                <div class='flex items-center leading-4 w-[90%]' key={i}>
                  <div>
                    <img
                      class='w-[50px] h-[50px] rounded-full'
                      src={users?.filter((usr) => usr?.uid === profile?.user).map((usr) => usr?.photoURL)}
                    />
                  </div>
                  <div class='font-bold ml-[10px]'>
                    <h6 class='font-bold'>{users?.filter((usr) => usr?.uid === profile?.user).map((usr) => usr?.name)}</h6>
                    {/* <span class='text-[12px] font-normal'>{users?.filter((usr) => usr?.uid === profile?.user).map((usr) => usr?.followers)} Followers</span> */}
                  </div>
                </div>
                <div>
                  <Button
                    background={'bg-lightest_gray'}
                    color={'text-black'}
                    hover={'hover:bg-black hover:text-white'}
                    classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0'}
                  >
                    Unfollow
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const PinBoard = ({ pins }) => {
  return (
    <div>
      {pins?.length === 0 ? (
        <div class='flex w-full items-center justify-center h-full'>
          <div class='flex w-[90%] items-center justify-center h-[89vh]'>
            <h1 class='font-bold text-[1.5rem]'>Add a pin to get started</h1>
          </div>
        </div>
      ) : (
        <div class='w-full flex items-center justify-center'>
          <div class='flex flex-col w-[95%]'>
            <div class='flex w-[3.5rem] bg-green rounded-md mb-[2rem] p-[0.4rem] items-center justify-center font-bold text-[14px]'>
              <MultiplePinsIcon />
              <span class='ml-[5px]'>{pins.length}</span>
            </div>
            <PinList pins={pins} />
          </div>
        </div>
      )}
    </div>
  );
};

const UserContent = ({ id }) => {
  const { boards, isAuthenticated, pins, users } = useAuthState();
  const [profileBoards, setProfileBoards] = useState();
  const [profilePins, setProfilePins] = useState();

  useEffect(() => {
    const boards_data = boards?.filter((usr) => usr?.author === id);
    const pins_data = pins?.filter((usr) => usr?.author === id);
    setProfileBoards(boards_data);
    setProfilePins(pins_data);
  }, []);

  return (
    <div class='w-full'>
      {isAuthenticated ? (
        <UserProfileBoards boards={profileBoards} pins={pins} />
      ) : (
        <div>
          <PinBoard pins={profilePins} />
        </div>
      )}
    </div>
  );
};
export default PublicUserProfile;
