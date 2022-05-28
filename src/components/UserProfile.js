import React, { useEffect, useState } from 'react';
import Modal from './UI/Modal';
import { useAuthState } from '../firebase/config';
import UserProfileBoards from './UI/UserProfileBoards';
import _ from 'lodash';
import ProfileHeader from './UI/ProfileHeader';

const UserProfile = () => {
  const { user, userProfile, userFollowers, userFollowing } = useAuthState();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState();
  const [followingCount, setFollowingCount] = useState();
  const [followersCount, setFollowersCount] = useState();
  const [toggleModal, setToggleModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [isCurrentUser, setCurrentUser] = useState(true);

  useEffect(() => {
    if (userFollowers <= 0) {
      setFollowersCount(0);
    } else {
      setFollowersCount(userFollowers?.length);
    }

    if (userFollowing <= 0) {
      setFollowingCount(0);
    } else {
      setFollowingCount(userFollowing?.length);
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
    <div class='w-full flex flex-col items-center justify-center mt-[2rem]'>
      {userProfile?.map((usr) => (
        <div key={usr?.uid} class='w-[97%] flex flex-col'>
          <ProfileHeader
            followersCount={followersCount}
            followingCount={followingCount}
            handleFollowers={handleFollowers}
            handleFollowing={handleFollowing}
            isCurrentUser={isCurrentUser}
            usr={usr}
          />

          <div class='flex items-start w-full'>
            <UserContent user={user} />
          </div>
        </div>
      ))}

      <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={showFollowers === true ? 'Followers' : 'Following'}>
        {showFollowers ? <FollowersList followers={userFollowers} /> : showFollowing ? <FollowingList following={userFollowing} /> : null}
      </Modal>
    </div>
  );
};

const UserContent = () => {
  const { userBoards, userPins } = useAuthState();
  return (
    <div class='w-full'>
      <UserProfileBoards boards={userBoards} pins={userPins} />
    </div>
  );
};

const FollowingList = ({ following }) => {
  const { users } = useAuthState();

  return (
    <div>
      {following?.length !== 0 ? (
        <div>
          {following?.map((filtereduser, i) => {
            return (
              <div class='w-full flex flex-col'>
                <div key={i} class='h-[100px] flex items-center justify-start'>
                  <img class='w-[60px] h-[60px] rounded-full object-cover' src={users?.filter((usr) => usr.uid == filtereduser.user)[0]?.photoURL} />
                  <p class='h-full flex items-center justify-center font-bold ml-[10px]'>
                    {users?.filter((usr) => usr.uid == filtereduser.user)[0]?.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>Not following anyone yet</div>
      )}
    </div>
  );
};

const FollowersList = ({ followers }) => {
  const { users } = useAuthState();
  return (
    <div>
      {followers?.length !== 0 ? (
        <div>
          {followers?.map((filtereduser, i) => {
            return (
              <div class='w-full flex flex-col'>
                <div key={i} class='h-[100px] flex items-center justify-center'>
                  <img class='w-[75px] h-[75px] rounded-full object-cover' src={users?.filter((usr) => usr.uid == filtereduser.user)[0]?.photoURL} />
                  <p class='h-full flex items-center justify-center font-bold'>{users?.filter((usr) => usr.uid == filtereduser.user)[0]?.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>No followers yet</div>
      )}
    </div>
  );
};

export default UserProfile;
