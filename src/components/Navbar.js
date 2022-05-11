import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { signOutAuthUser, getSearchParams } from '../store/features/appState';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import logo from './UI/Icons/logo.svg';
import { Popover, Transition } from '@headlessui/react';
import { useAuthState, db, logout } from '../firebase/config';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import SearchInputPopover from './UI/SearchInputPopover';
import DropdownMenu from './UI/DropdownMenu';
import SearchIcon from './UI/Icons/SearchIcon';
import MessagesIcon from './UI/Icons/MessagesIcon';
import NotificationsIcon from './UI/Icons/NotificationsIcon';
import UserProfileIcon from './UI/Icons/UserProfileIcon';
import ChevronDownIcon from './UI/Icons/ChevronDownIcon';
import _ from 'lodash';
import debounce from 'lodash.debounce';
import { v4 as uuidv4 } from 'uuid';
import portraits from './Images/portraits.jpg';
import makeup from './Images/makeup.jpg';
import nailart from './Images/nailart.jpg';
import landscapes from './Images/landscapes.jpg';
import healthyrecipes from './Images/healthyrecipes.jpg';
import wardrobe from './Images/wardrobe.jpg';
import homedecor from './Images/homedecor.jpg';
import animalphotography from './Images/animalphotography.jpg';

const Navbar = () => {
  const { user, pins, userSearches } = useAuthState();
  const navigate = useNavigate();
  const [profile, setProfile] = useState();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  let [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [toggleSearch, setToggleSearch] = useState(false);
  const [searchId, setSearchId] = useState();
  const searchInputRef = useRef();

  useEffect(() => {
    const createId = uuidv4().slice(0, 8);
    setSearchId(createId);
  }, []);

  const logout = () => {
    dispatch(signOutAuthUser());
    navigate('/signup');
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(handleOnChange, 1000), []);

  let filteredContent = pins;

  if (query !== '') {
    filteredContent = pins.filter((val) => {
      return val?.title?.toLowerCase().includes(query);
    });
  }

  const storeSearch = async () => {
    const searchRef = doc(db, `public_users`, `${user?.uid}`, 'searches', `${searchId}`);
    await setDoc(searchRef, {
      query: query,
      type: 'search',
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    storeSearch();
    dispatch(getSearchParams(query));
    navigate(`/search/${searchParams}`);
    setToggleSearch(!toggleSearch);
  };

  function handlePopover() {
    setToggleSearch(!toggleSearch);
  }

  const handleSignOut = async () => {
    logout();
  };

  console.log(searchId);

  const DropDownMenuButton = () => {
    return <ChevronDownIcon stroke={'black'} fill={'none'} classes={'h-4 w-4 hover:text-red'} aria-hidden='true' />;
  };

  const colors = ['bg-[#CCDCFF]', 'bg-[#F2FF55]', 'bg-[#B3FDE4]', 'bg-[#FFEBEB]', 'bg-[#FFDDBA]', 'bg-neutral-100'];
  var getRandomColor = _.sample(colors);

  return (
    <Fragment>
      <nav class='w-full h-[11vh] flex items-center'>
        <div class='grid mx-8 w-full grid-cols-12 items-center'>
          <div class='col-span-2 w-full flex items-center justify-start'>
            <div class='w-20'>
              <img class='max-w-7 min-w-7' src={logo} />{' '}
            </div>
            <div className='flex items-center justify-center'>
              <ul class='flex items-center justify-between px-[2rem] w-56 font-[600]'>
                <li class={location?.pathname === '/' ? 'bg-black text-white p-4 rounded-full' : null}>
                  <NavLink to='/'>Home</NavLink>
                </li>
                <li class={location?.pathname === '/featured' ? 'bg-black text-white p-4 rounded-full' : null}>
                  <NavLink to='/featured'>Stories</NavLink>
                </li>
              </ul>
            </div>
          </div>

          <div class='col-span-9'>
            <div class='flex justify-start px-9 '>
              <div class='w-full'>
                <div className='relative'>
                  <div class='absolute w-[3.3rem] flex top-0 h-[3rem] items-center justify-center z-0'>
                    <SearchIcon classes={'w-4 h-4 fill-neutral-500 '} />
                  </div>
                  <form onSubmit={handleOnSubmit}>
                    <input
                      ref={searchInputRef}
                      class={`w-full flex items-center h-12 rounded-full  text-neutral-900 border-0 focus:border-0 focus:ring-0  focus:outline-[6px] focus:outline-solid focus:outline-offset-0 focus:outline-blue-200 font-[500] placeholder:text-[#767676] placeholder: px-[3rem]  ${
                        toggleSearch === true ? 'bg-neutral-200' : 'bg-neutral-200'
                      }`}
                      onClick={handlePopover}
                      onFocus={() => setToggleSearch(true)}
                      // value={query}
                      onChange={debouncedChangeHandler}
                    />
                  </form>

                  {toggleSearch === true && (
                    <div class='w-full flex items-center'>
                      <div class='fixed inset-0 z-30 w-full' onClick={handlePopover}></div>
                      <Transition
                        as={Fragment}
                        show={toggleSearch}
                        enter='transition ease-out duration-200'
                        enterFrom='opacity-0 translate-y-1'
                        enterTo='opacity-100 translate-y-0'
                        leave='transition ease-in duration-150'
                        leaveFrom='opacity-100 translate-y-0'
                        leaveTo='opacity-0 translate-y-1'
                      >
                        <div className='absolute shadow-xl left-[50%] top-[3rem] z-40 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 h-[75vh] sm:px-0 lg:max-w-4xl bg-white rounded-br-xl rounded-bl-xl'>
                          <div class='flex flex-col mt-[2rem] mx-[2rem]'>
                            {query === '' ? (
                              <div class='flex flex-col'>
                                <div class='w-full'>
                                  <h1 class='font-[700] text-neutral-900'>Recent searches</h1>

                                  <ul class='flex mt-[1rem]'>
                                    {userSearches.slice(0, 6).map((searchq, i) => (
                                      <li
                                        key={i}
                                        class={`${colors[i]} font-medium rounded-full py-[12px] px-[1rem]  min-w-[80px] flex items-center justify-center outline-0 mr-[1rem]`}
                                      >
                                        {searchq?.query}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div class='w-full'>
                                  <h1 class='font-[700] text-neutral-900 mt-[3rem] gap-[10px]'>Ideas for you</h1>

                                  <ul class='flex flex-wrap mt-[1rem] w-[85%]   gap-[10px]'>
                                    <li
                                      style={{ backgroundImage: `url(${portraits})` }}
                                      class='bg-gray-900/50 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Portraits
                                      </div>
                                    </li>
                                    <li
                                      style={{ backgroundImage: `url(${makeup})` }}
                                      class='bg-lime-200 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Makeup
                                      </div>
                                    </li>
                                    <li
                                      style={{ backgroundImage: `url(${nailart})` }}
                                      class='bg-lime-200 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Nail art
                                      </div>
                                    </li>{' '}
                                    <li
                                      style={{ backgroundImage: `url(${landscapes})` }}
                                      class='bg-lime-200 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Landscapes
                                      </div>
                                    </li>{' '}
                                    <li
                                      style={{ backgroundImage: `url(${healthyrecipes})` }}
                                      class='bg-lime-200 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Healthy Recipes
                                      </div>
                                    </li>
                                    <li
                                      style={{ backgroundImage: `url(${wardrobe})` }}
                                      class='bg-lime-200 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Wardrobe
                                      </div>
                                    </li>{' '}
                                    <li
                                      style={{ backgroundImage: `url(${homedecor})` }}
                                      class='bg-lime-200 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Home decor
                                      </div>
                                    </li>{' '}
                                    <li
                                      style={{ backgroundImage: `url(${animalphotography})` }}
                                      class='bg-lime-200 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[4rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Animals
                                      </div>
                                    </li>
                                  </ul>
                                </div>

                                <div class='w-full'>
                                  <h1 class='font-[600] text-neutral-900 mt-[3rem] gap-[10px]'>Today's stories</h1>

                                  <ul class='flex flex-wrap mt-[1rem] w-[85%]   gap-[10px]'>
                                    <li
                                      style={{ backgroundImage: `url(${portraits})` }}
                                      class='bg-gray-900/50 rounded-xl h-[10rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[10rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Portraits
                                      </div>
                                    </li>
                                    <li
                                      style={{ backgroundImage: `url(${makeup})` }}
                                      class='bg-lime-200 rounded-xl h-[10rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[10rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Makeup
                                      </div>
                                    </li>
                                    <li
                                      style={{ backgroundImage: `url(${nailart})` }}
                                      class='bg-lime-200 rounded-xl h-[10rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[10rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Nail art
                                      </div>
                                    </li>{' '}
                                    <li
                                      style={{ backgroundImage: `url(${landscapes})` }}
                                      class='bg-lime-200 rounded-xl h-[10rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'
                                    >
                                      <div class='absolute bg-neutral-900/50 rounded-xl h-[10rem] w-[10rem] flex items-center justify-center font-bold bg-center bg-cover text-white'>
                                        Landscapes
                                      </div>
                                    </li>{' '}
                                  </ul>
                                </div>
                              </div>
                            ) : (
                              // <div class='mt-[2rem]'>
                              //   {pins
                              //     .filter((val) => {
                              //       if (query == '') {
                              //         return null;
                              //       } else if (val?.title?.toLowerCase().includes(query)) {
                              //         return val;
                              //       }
                              //     })
                              //     .map((val, key) => {
                              //       return (
                              //         <div class='flex items-center h-[3rem]'>
                              //           <SearchIcon classes={'w-5 h-5 mr-[5px]'} stroke={'black'} fill={'none'} />
                              //           <h3 class='font-bold'>{val.title}</h3>
                              //         </div>
                              //       );
                              //     })}
                              // </div>
                              <div class='mt-[2rem]'>
                                {filteredContent.length !== 0 ? (
                                  <div>
                                    {filteredContent.map((val, i) => {
                                      return (
                                        <div key={i} class='flex items-center h-[3rem]'>
                                          <SearchIcon classes={'w-5 h-5 mr-[5px]'} stroke={'black'} fill={'none'} />
                                          <h3 class='font-bold'>{val.title}</h3>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div>
                                    <h3>
                                      No matches found for "<b>{query}</b>"
                                    </h3>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </Transition>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div class='col-span-1'>
            <div class='w-full flex items-center justify-between'>
              <button>
                {' '}
                <MessagesIcon classes={'w-5 h-5 fill-neutral-600'} />
              </button>
              <button>
                {' '}
                <NotificationsIcon classes={'w-5 h-5 fill-neutral-600'} />
              </button>

              <button>
                {' '}
                <NavLink to='/myprofile'>
                  <img class='w-[25px] h-[25px] rounded-full outline outline-1 outline-neutral-400 outline-offset-2' src={user?.photoURL} />
                </NavLink>
              </button>
              <DropdownMenu
                one={'Settings'}
                two={'Tune your home page'}
                three={'Terms and privacy'}
                four={'Get Help'}
                five={'Log out'}
                button={DropDownMenuButton}
                buttonClasses={'flex items-center text-sm font-medium text-white bg-transparent rounded-md'}
                menuClasses={
                  'absolute right-0 w-56 mt-2 mr-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20'
                }
                linkOne={'/settings'}
                linkTwo={null}
                linkThree={null}
                linkFour={null}
                linkFive={null}
                onClickFive={handleSignOut}
              />
            </div>
          </div>
        </div>
      </nav>
    </Fragment>
  );
};

export default Navbar;
