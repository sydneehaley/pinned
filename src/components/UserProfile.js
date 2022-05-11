import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import Modal from './UI/Modal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { toggleUserBoards } from '../store/features/appState';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, useAuthState } from '../firebase/config';
import Button from './UI/Button';
import ArrowLeft from './UI/Icons/ArrowLeft';
import MoreIcon from './UI/Icons/MoreIcon';
import ImageIcon from './UI/Icons/ImageIcon';
import CollectionsIcon from './UI/Icons/CollectionsIcon';
import _ from 'lodash';
import ProfileHeader from './UI/ProfileHeader';
import { PinDrop } from '@mui/icons-material';

const UserProfile = (props) => {
  const { user, userProfile, userFollowers, userFollowing } = useAuthState();
  console.log(user?.uid);
  const location = useLocation();
  const { id } = useParams();
  console.log(id);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [followersCount, setFollowersCount] = useState();
  const [toggleModal, setToggleModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isCurrentUser, setCurrentUser] = useState(true);

  useEffect(() => {
    setProfile(userProfile);
    setFollowersCount(userProfile[0]?.followers_count);
    setFollowingCount(userProfile[0]?.following_count);
  }, []);

  console.log(userFollowing);

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
    <div class='w-[95%] flex flex-col items-center mt-[2rem]'>
      {profile?.map((usr) => (
        <div class='w-full flex flex-col'>
          <ProfileHeader
            followersCount={followersCount}
            followingCount={followingCount}
            handleFollowers={handleFollowers}
            handleFollowing={handleFollowing}
            isCurrentUser={isCurrentUser}
            usr={usr}
          />

          <div>
            <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={showFollowers === true ? 'Followers' : 'Following'}>
              {showFollowers ? <FollowersList followers={userFollowers} /> : showFollowing ? <FollowingList following={userFollowing} /> : null}
            </Modal>
          </div>

          <div class='flex items-start w-full'>
            <UserContent user={user} />
          </div>
        </div>
      ))}
    </div>
  );
};

const UserContent = () => {
  const { user, userBoards, userPins, users } = useAuthState();
  return (
    <div class='w-full flex items-start justify-start'>
      <div class='w-[95%] flex flex-col items-start justify-start'>
        <div class='w-full columns-auto gap-[20px] flex'>
          {userBoards.map((board) => (
            <div>
              <Link to={`/boards/${board.id}/${board.title}`} style={{ cursor: 'zoom-in' }}>
                {userPins?.filter((img) => img.board === board?.title).length === 0 ? (
                  <div class='bg-lightest_gray  h-[11rem] rounded-md flex items-center justify-center'>
                    <ImageIcon classes={'w-8 h-8'} fill={'#767676'} />
                  </div>
                ) : (
                  <img
                    class=' h-[11rem] rounded-md rounded-xl object-cover'
                    src={
                      userPins?.filter((img) => img?.board === board?.title)[
                        `${userPins.filter((boards) => boards.board === board.title).length - 1}`
                      ]?.img_url
                    }
                  />
                )}
              </Link>
              <h6 class='font-bold mt-[1rem]'>{board?.title}</h6>
              <span class='text-[12px]'>{userPins.filter((boards) => boards.board === board.title).length} pins</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FollowingList = ({ following }) => {
  const { users } = useAuthState();
  return (
    <div>
      {users
        ?.filter((user) => user?.uid === following[0])
        .map((user) => {
          return (
            <div class='w-full flex flex-col'>
              <div class='h-[100px] flex items-center justify-start'>
                {' '}
                <img class='w-[60px] h-[60px] rounded-full object-cover' src={user?.photoURL} />{' '}
                <p class='h-full flex items-center justify-center font-bold ml-[10px]'>{user?.name}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

const FollowersList = ({ followers }) => {
  const { users } = useAuthState();
  return (
    <div>
      {users
        ?.filter((user) => user?.uid === followers[0])
        ?.map((user) => {
          return (
            <div class='w-full flex flex-col'>
              <div class='h-[100px] flex items-center justify-center'>
                {' '}
                <img class='w-[75px] h-[75px] rounded-full object-cover' src={user?.profile_image} />{' '}
                <p class='h-full flex items-center justify-center font-bold'>{user?.name}</p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default UserProfile;
