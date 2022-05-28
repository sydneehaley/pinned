import React, { Fragment, useState, useEffect, useRef, useCallback, useId } from 'react';
import { useNavigate, useLocation, createSearchParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import logo from './UI/Icons/logo.svg';
import { Transition } from '@headlessui/react';
import { useAuthState, db, signout } from '../firebase/config';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import DropdownMenu from './UI/DropdownMenu';
import SearchIcon from './UI/Icons/SearchIcon';
import MessagesIcon from './UI/Icons/MessagesIcon';
import NotificationsIcon from './UI/Icons/NotificationsIcon';
import ChevronDownIcon from './UI/Icons/ChevronDownIcon';
import _ from 'lodash';
import debounce from 'lodash.debounce';

const Navbar = () => {
  const { user, users } = useAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [toggleSearch, setToggleSearch] = useState(false);

  const handleOnChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(handleOnChange, 1000), []);

  const useNavigateSearch = () => {
    return (pathname, params) => navigate(`${pathname}?${createSearchParams(params)}`);
  };

  const navigateSearch = useNavigateSearch();

  const goToSearchLanding = () => navigateSearch('/search', { content: query.toLowerCase() });

  const storeSearch = async () => {
    const searchRef = doc(db, `public_users`, `${user?.uid}`, 'searches', `${query}`);
    await setDoc(searchRef, {
      query: query,
      type: 'search',
    });
  };

  const storeCurrSearch = async () => {
    const queryRef = doc(db, `public_users`, `${user?.uid}`, 'currSearchQuery', 'query');
    await updateDoc(queryRef, { query: query.toLowerCase() });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    goToSearchLanding();
    storeCurrSearch();
    storeSearch();
    setQuery('');
  };

  const handleSignOut = async () => {
    signout();
    navigate('/signup');
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

  return (
    <Fragment>
      {location.pathname == '/signup' ? (
        <nav></nav>
      ) : (
        <nav class='w-full h-[11vh] flex items-center justify-center  bg-white'>
          <div class='flex w-[97%] items-center justify-center'>
            <div class='mr-[1rem]'>
              <div class='flex items-center justify-start'>
                <img class='max-w-[20px] max-h-[20px]' src={logo} />
              </div>
            </div>
            <div class='grid w-full grid-cols-9 row-span-1 items-center'>
              <div className='col-span-1 ml-[1rem]'>
                <ul class='flex items-center justify-between w-[135px]  max-h-[48px] font-[700]'>
                  <li
                    class={
                      location?.pathname === '/'
                        ? 'bg-black text-white py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0  rounded-full flex items-center justify-center'
                        : null
                    }
                  >
                    <NavLink to='/'>Home</NavLink>
                  </li>
                  <li
                    class={
                      location?.pathname === '/stories'
                        ? 'bg-black text-white py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0  rounded-full flex items-center justify-center'
                        : null
                    }
                  >
                    <NavLink to='/stories'>Today</NavLink>
                  </li>
                </ul>
              </div>

              <div class='col-span-7'>
                <div class='flex justify-start'>
                  <div class='w-full'>
                    <div className='relative'>
                      <div class='absolute w-[3.3rem] flex top-0 h-[3rem] items-center justify-center left-[33px] z-0'>
                        <SearchIcon classes={'w-4 h-4 fill-neutral-500 '} />
                      </div>
                      <form class='pl-[2rem]' onSubmit={handleOnSubmit}>
                        <input
                          class={`w-[97%]  flex items-center h-12 rounded-full  text-neutral-900 border-0 focus:border-0 focus:ring-0  focus:outline-[6px] focus:outline-solid focus:outline-offset-0 focus:outline-blue-200 font-[500] placeholder:text-[#767676] placeholder: px-[3rem]  ${
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
                <div class='w-[90%] flex items-center justify-between'>
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
                    <NavLink to='/profile'>
                      {user?.photoURL == null ? (
                        <div className='w-[25px] h-[25px] rounded-full outline outline-1 outline-neutral-400 outline-offset-2 text-neutral-900 bg-neutral-200 text-[10px] font-bold flex items-center justify-center'>
                          U
                        </div>
                      ) : (
                        <img class='w-[25px] h-[25px] rounded-full outline outline-1 outline-neutral-400 outline-offset-2' src={user?.photoURL} />
                      )}
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
          </div>
        </nav>
      )}
    </Fragment>
  );
};

const SearchPopoverContent = ({ toggle, closeDropdown, query }) => {
  const { user, pins, userSearches } = useAuthState();
  const createId = useId();

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

  const goToSearchLanding = (val) => navigateSearch('/search', { content: val.toLowerCase() });

  const storeCurrSearch = async (val) => {
    const currSearchRef = doc(db, `public_users`, `${user?.uid}`, 'currSearchQuery', `query`);
    await updateDoc(currSearchRef, {
      query: val,
    });
  };

  const handleSearchClick = (e) => {
    let val = e.currentTarget.dataset.tag.toString();
    console.log(val);
    storeCurrSearch(val);
    goToSearchLanding(val);
  };

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
        <div className='absolute shadow-xl left-[50%] top-[3rem] z-50 mt-3 w-[56rem]  -translate-x-1/2 transform px-4 h-[37vh]  bg-white rounded-br-xl rounded-bl-xl'>
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
                      <ul class='pl-[2rem] flex flex-col items-start'>
                        {filteredContent?.slice(0, 6).map((val, i) => {
                          return (
                            <li key={i} class={`font-medium cursor-pointer mb-[1.5rem]`} data-tag={val.title} onClick={handleSearchClick}>
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
                  <div class='pl-[2rem] flex flex-col items-start'>
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
