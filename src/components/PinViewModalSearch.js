import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { updateDoc, doc, deleteDoc, collection, onSnapshot, setDoc } from 'firebase/firestore';
import { useLocation, useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuthState } from '../firebase/config';
import { db } from '../firebase/config';
import Modal from './UI/Modal';
import Button from './UI/Button';
import BoardsMenuModal from './UI/BoardsMenuModal';
import ShareIcon from './UI/Icons/ShareIcon';
import HeartOutlineIcon from './UI/Icons/HeartOutlineIcon';
import MoreIcon from './UI/Icons/MoreIcon';
import ChevronLeftIcon from './UI/Icons/ChevronLeftIcon';
import ChevronRightIcon from './UI/Icons/ChevronRightIcon';
import DropDownMenu from './UI/DropdownMenu';

export default function PinViewModalSearch({ classes }) {
  const getQuery = useSelector((state) => state.pingallery.searchParams);
  const { user, pins, users, userFollowing, currSearch } = useAuthState();
  const { id } = useParams();
  console.log(id);
  let navigate = useNavigate();
  const pinRef = doc(db, 'content', `${id}`);
  const location = useLocation();
  console.log(location);
  const [showDialog, setShowDialog] = useState(true);
  const [loading, setLoading] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [editPin, setEditPin] = useState(false);
  const [pinAuthor, setPinAuthor] = useState();
  const [authorFollowersCount, setAuthorFollowersCount] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const storedSearch = currSearch;
  console.log(storedSearch);
  const [prevPin, setPrevPin] = useState({
    title: '',
    description: '',
    target: '',
  });

  useEffect(() => {
    setLoading(true);
    if (pins != null) {
      setLoading(false);
      const findPin = pins?.filter((pin) => pin?.id === id);
      const pin_author = findPin[0]?.author;
      if (userFollowing.filter((usr) => usr.user === pin_author).length !== 0) {
        setIsFollowing(true);
      }
      setPinAuthor(pin_author);
      const userFollowersRef = collection(db, 'public_users', `${pin_author}`, 'followers');
      onSnapshot(userFollowersRef, (querySnapshot) => {
        const user_followers = [];
        querySnapshot.docs.forEach((doc) => {
          user_followers.push(doc.data());
        });

        if (user_followers.filter((usrs) => usrs.type === 'follower').length <= 0) {
          setAuthorFollowersCount(0);
        } else {
          setAuthorFollowersCount(user_followers.filter((usrs) => usrs.type === 'follower').length);
        }
      });
    }

    // setPrevPin({ title: findPin[0]?.title, description: findPin[0]?.description, target: findPin[0]?.target });
  }, []);

  function onDismiss() {
    navigate(`/search?content=${currSearch}`);
  }

  const closeModal = () => {
    setShowDialog(false);
  };

  const currPin = (element) => {
    return Number(element?.id === id);
  };

  const currIndex = Number(pins?.findIndex(currPin));

  const DropDownMenuButton = () => {
    return <MoreIcon classes={'w-5 h-5 fill-neutral-700'} fill={'#000000'} />;
  };

  const handleEditPin = () => {
    setEditPin(true);
  };

  const handleOnChange = (e) => {
    setPrevPin((pin) => ({
      ...pin,
      [e.target.name]: e.target.value,
    }));
  };

  const updatePin = async () => {
    await updateDoc(pinRef, {
      title: prevPin?.title,
      description: prevPin?.description,
      target: prevPin?.target,
    });
  };

  const deletePin = async () => {
    await deleteDoc(pinRef);
    navigate('/');
  };

  const openDeletePinModal = () => {
    setToggleModal(true);
  };

  const closeDeletePinModal = () => {
    setToggleModal(false);
  };

  const handleFollow = async (pin) => {
    const followingRef = doc(db, `public_users`, `${user?.uid}`, 'following', `${pin?.author}`);
    await setDoc(followingRef, { following: true, type: 'following', user: `${pin?.author}` });
    const followerRef = doc(db, `public_users`, `${pin?.author}`, 'followers', `${user?.uid}`);
    await setDoc(followerRef, { follower: true, type: 'follower', user: `${pin?.author}` });
    setIsFollowing(true);
  };

  const handleUnfollow = async (pin) => {
    const followersRef = doc(db, 'public_users', `${pin?.author}`, 'followers', `${user?.uid}`);
    const followingRef = doc(db, `public_users`, `${user?.uid}`, 'following', `${pin?.author}`);
    await deleteDoc(followersRef);
    await deleteDoc(followingRef);
    setIsFollowing(false);
    console.log(pin?.author);
  };

  return (
    <>
      <Transition appear show={showDialog} as={Fragment}>
        <Dialog as='div' className='fixed inset-0 z-30 overflow-y-auto' onClose={onDismiss}>
          <div className='min-h-screen px-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Overlay className='fixed inset-0 bg-gray-900/50' />
            </Transition.Child>

            <span className='inline-block h-screen align-middle' aria-hidden='true'>
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <div className={`inline-flex w-[80%]  overflow-hidden text-left align-middle transition-all transform   h-[70vh] ${classes}`}>
                {currIndex > 0 && (
                  <div class='flex items-center justify-center h-[70vh] w-[5%] '>
                    <Link
                      to={`/search/view/pin/${currIndex === 0 ? `${pins[currIndex + 0]?.id}` : `${pins[currIndex - 1]?.id}`}`}
                      style={{ cursor: 'pointer' }}
                      state={{ background: { ...location, pathname: '/search', search: `?content=${storedSearch}` } }}
                    >
                      <ChevronLeftIcon classes={'w-8 h-8 drop-shadow-md'} stroke={'white'} />
                    </Link>
                  </div>
                )}
                {pins
                  ?.filter((pin, i) => pin.id === id)
                  .map((pin, i) => (
                    <div class='w-full flex shadow-xl rounded-2xl'>
                      <div class='w-[50%] flex h-[70vh]'>
                        <img class='rounded-tl-2xl rounded-bl-2xl object-cover w-full' src={pin?.img_url} />
                      </div>
                      <div class='w-[50%] flex flex-col p-[2rem] bg-white rounded-tr-2xl rounded-br-2xl'>
                        <div class='w-full flex mb-[3rem] items-center'>
                          <div class={`w-[17%] flex justify-between`}>
                            <ShareIcon classes='w-5 h-5 fill-neutral-700' />
                            <HeartOutlineIcon stroke={'neutral-700'} fill={'none'} classes={'w-5 h-5 stroke-neutral-700'} />

                            <div>
                              {' '}
                              <DropDownMenu
                                one={user?.uid === pin?.author ? 'Edit Pin' : 'Report Pin'}
                                two={user?.uid === pin?.author ? 'Delete Pin' : null}
                                button={DropDownMenuButton}
                                buttonClasses={'flex items-center justify-center m-0'}
                                menuClasses={
                                  'absolute left-[59%] w-56 mt-2 mr-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20'
                                }
                                linkOne={null}
                                linkTwo={null}
                                linkThree={null}
                                linkFour={null}
                                linkFive={null}
                                onClickOne={user?.uid === pin?.author ? handleEditPin : null}
                                onClickTwo={user?.uid === pin?.author ? openDeletePinModal : null}
                              />
                            </div>
                          </div>
                          <div class={`w-[83%] flex justify-end items-center`}>
                            <div class='mr-[10px]'>
                              <BoardsMenuModal id={id} buttonClasses={'text-neutral-700'} iconStroke={'stroke-neutral-700'} />
                            </div>

                            {editPin === true && (
                              <div>
                                <Button
                                  background={'bg-red'}
                                  hover={'hover:bg-black hover:text-white'}
                                  color={'text-white'}
                                  onClickAction={updatePin}
                                  classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0'}
                                >
                                  Save
                                </Button>
                                <Button
                                  background={'bg-neutral-200'}
                                  hover={'hover:bg-black hover:text-white'}
                                  color={'text-black'}
                                  onClickAction={() => setEditPin(false)}
                                  classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 ml-[5px]'}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div class='flex flex-col mb-[2rem]'>
                          <span class='font-regular text-[14px] text-medium_gray'>Published on</span>
                          <div>
                            {editPin === true ? (
                              <input
                                name='title'
                                class=' border-placeholders outline:none border-0 focus:ring-0 focus:border-blue-500 focus:outline-none w-full m-0  pl-0  text-[36px] font-bold text-black placeholder:text-placeholders  focus:border-b-2'
                                onChange={handleOnChange}
                                value={prevPin?.title}
                                placeholder='Title'
                              ></input>
                            ) : (
                              <h1 class='font-bold text-[3rem]'>{pin?.title}</h1>
                            )}
                          </div>
                        </div>

                        <div class='w-full flex'>
                          <div class='w-[80%] flex items-center'>
                            <div class='pr-[10px]'>
                              <img
                                class='w-[50px] h-[50px] rounded-full'
                                src={users?.filter((usr) => usr?.uid === pin?.author).map((usr) => usr?.photoURL)}
                              />
                            </div>
                            <div class='flex flex-col'>
                              <h6 class='font-bold text-[16px]'>{users?.filter((usr) => usr?.uid === pin?.author).map((usr) => usr?.name)}</h6>
                              <span class='font-regular text-[12px]'>
                                {users?.filter((usr) => usr?.uid === pin?.author).map((usr) => usr?.followers_count)} {authorFollowersCount} Followers
                              </span>
                            </div>
                          </div>
                          {user?.uid !== pin?.author && (
                            <div>
                              <Button
                                background={` ${isFollowing === true ? 'bg-red' : 'bg-neutral-200'} `}
                                hover={'hover:bg-black hover:text-white'}
                                classes={`py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 mr-[1rem] ${
                                  isFollowing === true ? 'text-white' : 'text-black'
                                }`}
                                onClickAction={isFollowing === true ? () => handleUnfollow(pin) : () => handleFollow(pin)}
                              >
                                {isFollowing === true ? 'Following' : 'Follow'}
                              </Button>
                            </div>
                          )}
                        </div>

                        <div class='mt-[4rem]'>
                          <div>
                            {editPin === true ? (
                              <input
                                name='description'
                                class='flex focus:border-blue-500 focus:outline-none font-medium w-full focus:ring-0 focus:border-blue-500 focus:border-b-2 border-placeholders border-b-1 border-t-0 border-l-0 border-r-0 border-solid pl-0 pr-0 py-[0.5rem] placeholder:text-light_placeholders placeholder:font-normal placeholder:text-[1rem]'
                                placeholder='Tell everyone what your Pin is about'
                                value={prevPin?.description}
                                onChange={handleOnChange}
                              ></input>
                            ) : (
                              <p class=' mb-[1rem]'>{pin?.description}</p>
                            )}
                          </div>
                          <div>
                            {editPin === true ? (
                              <input
                                name='target'
                                class='flex text-[18px] focus:border-blue-500 focus:outline-none font-bold w-full focus:ring-0 focus:border-blue-500 focus:border-b-2 border-placeholders border-b-1 border-t-0 border-l-0 border-r-0 border-solid pl-0 pr-0 py-[0.5rem] placeholder:text-light_placeholders placeholder:font-normal placeholder:text-[1rem] placeholder:text-[18px]'
                                placeholder='Add a destination link'
                                value={prevPin?.target}
                                onChange={handleOnChange}
                              ></input>
                            ) : (
                              <a href={'http://' + pin?.target} target='_blank' class='font-bold mt-[1rem]'>
                                {pin?.target}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {currIndex < pins?.length - 1 && (
                  <div class='flex items-center justify-center h-[70vh] w-[5%] '>
                    <Link
                      to={`/search/view/pin/${currIndex === pins.length - 1 ? `${pins[currIndex + 0]?.id}` : `${pins[currIndex + 1]?.id}`}`}
                      style={{ cursor: 'pointer' }}
                      state={{ background: { ...location, pathname: '/search', search: `?content=${storedSearch}` } }}
                    >
                      <ChevronRightIcon classes={'w-8 h-8 drop-shadow-md'} stroke={'white'} />
                    </Link>
                  </div>
                )}
              </div>
            </Transition.Child>

            <div>
              <Modal isOpen={toggleModal} closeModal={closeDeletePinModal} openModal={openDeletePinModal} title={'Delete Pin'}>
                <div class='w-full flex items-center justify-end'>
                  <div class='flex items-center justify-center'>
                    <Button background={'bg-red'} hover={'hover:bg-black hover:text-white'} color={'text-white'} onClickAction={deletePin}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
