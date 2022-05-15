import React, { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import { signOutAuthUser, getSearchParams, setSearchActive } from '../store/features/appState';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, useLocation, createSearchParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import logo from './UI/Icons/logo.svg';
import { Popover, Transition } from '@headlessui/react';
import { useAuthState, db, logout } from '../firebase/config';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
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
  const { user } = useAuthState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [toggleSearch, setToggleSearch] = useState(false);

  useEffect(() => {}, []);

  const logout = () => {
    dispatch(signOutAuthUser());
    navigate('/signup');
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(handleOnChange, 1000), []);

  const useNavigateSearch = () => {
    const navigate = useNavigate();
    return (pathname, params) => navigate(`${pathname}?${createSearchParams(params)}`);
  };

  const navigateSearch = useNavigateSearch();

  const goToSearchLanding = () => navigateSearch('/search', { content: query });

  const storeSearch = async () => {
    const searchRef = doc(db, `public_users`, `${user?.uid}`, 'searches', `${query}`);
    await setDoc(searchRef, {
      query: query,
      type: 'search',
    });
  };

  const storeCurrSearch = async () => {
    const queryRef = doc(db, `public_users`, `${user?.uid}`, 'currSearchQuery', 'query');
    await setDoc(queryRef, { query: query, type: 'currSearch' });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    goToSearchLanding();
    // dispatch(getSearchParams(query));
    storeCurrSearch();
    storeSearch();
    setQuery('');
  };

  console.log(query);

  const handleSignOut = async () => {
    logout();
  };

  const DropDownMenuButton = () => {
    return <ChevronDownIcon stroke={'black'} fill={'none'} classes={'h-4 w-4 hover:text-red'} aria-hidden='true' />;
  };

  const openInputDropdown = () => {
    setToggleSearch(true);
  };

  const closeInputDropdown = () => {
    setToggleSearch(false);
  };

  console.log(toggleSearch);

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
                      class={`w-full flex items-center h-12 rounded-full  text-neutral-900 border-0 focus:border-0 focus:ring-0  focus:outline-[6px] focus:outline-solid focus:outline-offset-0 focus:outline-blue-200 font-[500] placeholder:text-[#767676] placeholder: px-[3rem]  ${
                        toggleSearch === true ? 'bg-neutral-200' : 'bg-neutral-200'
                      }`}
                      value={query}
                      name='query'
                      onClick={openInputDropdown}
                      onChange={handleOnChange}
                    />
                  </form>

                  {toggleSearch === true && <SearchPopoverContent toggle={toggleSearch} closeDropdown={closeInputDropdown} query={query} />}
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

const SearchPopoverContent = ({ toggle, closeDropdown, query }) => {
  const { user, pins, userSearches } = useAuthState();
  const [currIndex, setCurrIndex] = useState();
  const listItemRef = useRef();
  useEffect(() => {
    // const createId = uuidv4().slice(0, 8);
    // setSearchId(createId);
    console.log(userSearches);
  }, []);

  // const handleOnChange = (e) => {
  //   e.preventDefault();
  //   setQuery(e.target.value);
  // };

  let filteredContent = pins;

  if (query !== '') {
    filteredContent = pins.filter((val) => {
      return val?.title?.toLowerCase().includes(query);
    });
  }

  const useNavigateSearch = () => {
    const navigate = useNavigate();
    return (pathname, params) => navigate(`${pathname}?${createSearchParams(params)}`);
  };

  const navigateSearch = useNavigateSearch();

  const goToSearchLanding = (val) => navigateSearch('/search', { content: val });

  const storeSearch = async (val) => {
    const currSearchRef = doc(db, `public_users`, `${user?.uid}`, 'currSearchQuery', `query`);
    await updateDoc(currSearchRef, {
      query: val,
      type: 'currSearch',
    });
  };

  const handleSearchClick = (e) => {
    let val = e.currentTarget.dataset.tag.toString();
    console.log(val);
    storeSearch(val);
    goToSearchLanding(val);
  };

  console.log(currIndex);

  return (
    <div class='w-full flex items-center'>
      <div class='fixed inset-0 z-10 w-full' onClick={closeDropdown}></div>
      <Transition
        as={Fragment}
        show={toggle}
        enter='transition ease-out duration-200'
        enterFrom='opacity-0 translate-y-1'
        enterTo='opacity-100 translate-y-0'
        leave='transition ease-in duration-150'
        leaveFrom='opacity-100 translate-y-0'
        leaveTo='opacity-0 translate-y-1'
      >
        <div className='absolute shadow-xl left-[50%] top-[3rem] z-50 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 h-[37vh] sm:px-0 lg:max-w-4xl bg-white rounded-br-xl rounded-bl-xl'>
          <div class='flex flex-col h-full justify-center items-start'>
            {query === '' ? (
              <div class='flex flex-col '>
                <div class='w-full  '>
                  <ul class='pl-[2rem] flex flex-col items-start'>
                    {userSearches.slice(0, 6).map((searchq, i) => (
                      <li key={i} class={`font-medium  cursor-pointer mb-[1.5rem]`} data-tag={searchq.query} onClick={handleSearchClick}>
                        <div class='flex items-center'>
                          <SearchIcon classes={'w-3 h-3 mr-[7px]'} fill={'black'} />
                          {searchq?.query}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                {filteredContent?.length !== 0 ? (
                  <div class='flex flex-col'>
                    <div class='w-full'>
                      <ul class='flex flex-col items-start'>
                        {filteredContent?.slice(0, 6).map((val, i) => {
                          return (
                            <li key={i} class={`font-medium rounded-full min-w-[80px] flex items-center cursor-pointer mb-[1.5rem]`}>
                              <div class='flex items-center'>
                                <SearchIcon classes={'w-3 h-3 mr-[7px]'} fill={'black'} />
                                {val.title}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
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
  );
};

export default Navbar;
