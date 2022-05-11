import React, { useState, useEffect, useRef, Fragment, useCallback } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';
import { Listbox, Transition, Switch } from '@headlessui/react';
import AddIcon from './Icons/AddIcon';
import debounce from 'lodash.debounce';
import { db, useAuthState } from '../../firebase/config';
import ChevronDownIcon from './Icons/ChevronDownIcon';
import { CheckIcon } from '@heroicons/react/solid';
import SearchIcon from './Icons/SearchIcon';
import Button from './Button';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import Modal from './Modal';
import CreateBoard from '../CreateBoard';
import ImageIcon from './Icons/ImageIcon';
// const people = [{ name: 'Photography' }, { name: 'Dogs' }, { name: 'Fashion' }, { name: 'Cats' }, { name: 'Tanya Fox' }, { name: 'Hellen Schmidt' }];

const BoardsMenu = ({ id, buttonClasses, iconStroke }) => {
  const [boards, setBoard] = useState();
  const { pins, user, userBoards, userPins, userSavedPins } = useAuthState();
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState();
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [own, setOwn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [verify, setVerify] = useState(false);

  console.log(pins?.filter((pin) => pin?.id === id));

  useEffect(() => {
    setLoading(true);
    if (userPins?.filter((pin) => pin?.id === id).length !== 0) {
      setSelected(userPins.filter((pin) => pin?.id === id)[0]);
      console.log(userPins.filter((pin) => pin?.id === id)[0]);
      console.log('user owns pin');
      setOwn(true);
      setLoading(false);
    }

    if (userSavedPins?.filter((pin) => pin?.id === id).length !== 0) {
      setSelected(userSavedPins.filter((pin) => pin?.id === id)[0]);
      console.log(userSavedPins.filter((pin) => pin?.id === id)[0]);
      console.log('user saved pin');
      setSaved(true);
      setLoading(false);
    }
    if (userPins?.filter((pin) => pin?.id === id).length === 0 && userSavedPins?.filter((pin) => pin?.id === id).length === 0) {
      console.log('pin not owned or saved');
      setSelected(pins?.filter((pin) => pin?.id === id)[0]);
      setLoading(false);
    }
  }, []);

  const updateMyPin = async (newSelection) => {
    const pinRef = doc(db, 'content', `${id}`);
    await updateDoc(pinRef, {
      board: newSelection,
    });
  };

  const addSavedPin = async (saveToMyBoard) => {
    const newSavedPinRef = doc(db, 'public_users', `${user?.uid}`, 'saved_pins', `${id}`);
    await setDoc(newSavedPinRef, saveToMyBoard);
  };

  const updateSavedPin = async (newSelection) => {
    const savedPinRef = doc(db, 'public_users', `${user?.uid}`, 'saved_pins', `${id}`);
    await updateDoc(savedPinRef, {
      savedToMyBoard: newSelection,
    });
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(handleOnChange, 1000), []);

  const handleBoardChange = (newSelection) => {
    setSelected(newSelection);
    if (own === true) {
      updateMyPin(newSelection.board);
      console.log('pin owned');
    }

    if (own === false && saved === false) {
      const findPin = pins?.filter((pin) => pin?.id === id);
      const saveToMyBoard = findPin?.map(function (pin, i) {
        return Object.assign({ savedToMyBoard: newSelection.board || newSelection.title, saved: true, id: id });
      });

      console.log(saveToMyBoard[0]);
      addSavedPin(saveToMyBoard[0]);
    }

    if (saved === true) {
      updateSavedPin(newSelection.board);
    }
  };

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  console.log(selected);

  const verifyBoard = (board) => {
    if (selected?.savedToMyBoard === board?.title || selected?.board === board?.title || selected?.title === board?.title) {
      console.log('this is true');
      return (
        <span className='absolute inset-y-0 left-[0] flex items-center flex w-full justify-end text-red pr-[10px]'>
          <CheckIcon className='w-5 h-5' aria-hidden='true' />
        </span>
      );
    } else {
      return null;
    }
  };

  return (
    <Listbox value={selected} onChange={handleBoardChange} as='div'>
      <div className='relative m-0'>
        <div class='relative flex w-full justify-end items-end'>
          <Listbox.Button className=' max-h-[40px] rounded-tl-lg rounded-bl-lg  py-[14px] cursor-pointer flex items-center focus:outline-0'>
            <span class={`font-bold  ${buttonClasses}  flex justify-end pr-[10px]`}>
              {selected?.board || selected?.savedToMyBoard || selected?.title}
            </span>
            <span class=' flex justify-end'>
              <ChevronDownIcon fill={'none'} classes={`text-medium_gray w-4 h-4 ${iconStroke}`} />
            </span>
          </Listbox.Button>
        </div>
        <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
          <Listbox.Options
            className='absolute w-[18rem] -left-[220px] p-0 mt-[1rem] overflow-auto text-base bg-white  rounded-md shadow-lg h-[22rem] ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
            onClick={() => setToggleSearch(!toggleSearch)}
          >
            <div class='h-[30%] px-4'>
              <h6 class='font-bold pb-[1rem] pt-[1rem] flex items-center justify-start'>Save to Board</h6>

              <div class='absolute h-[50px] flex items-center left-[30px]'>
                <SearchIcon classes={'w-4 h-4 fill-neutral-500 '} />
              </div>

              <input
                class='border-neutral-300 border-2 w-full rounded-full h-[50px] focus:outline-0 pt-[1rem] pb-[1rem] pr-[1rem] pl-[2.5rem]'
                // value={query}
                onChange={debouncedChangeHandler}
              />
            </div>
            <div class='h-[70%]'>
              <div class='h-[72%] overflow-x-scroll p-4'>
                {/* <h6 class='font-bold pb-[0.5rem] text-xs'>My Boards</h6> */}
                {userBoards
                  ?.filter((board) => {
                    if (query == '') {
                      return userBoards;
                    } else if (board.title?.toLowerCase().includes(query)) {
                      return board;
                    }
                  })
                  .map((board, i) => {
                    return (
                      <Listbox.Option
                        key={i}
                        className={({ active }) => `cursor-pointer select-none relative  pl-0  rounded-xl ${active ? 'text-black' : 'text-gray-900'}`}
                        name='title'
                        value={board}
                      >
                        {({ selected }) => (
                          <div
                            class={`h-[4rem] flex items-center rounded-lg hover:bg-neutral-100 ${
                              selected === board?.title ? 'bg-red' : 'bg-transparent'
                            }`}
                            onMouseOver={() => {
                              setCurrIndex(i);
                            }}
                            onMouseLeave={() => {
                              setCurrIndex(null);
                            }}
                          >
                            <div className={`block truncate flex items-center pl-[0.5rem] ${selected ? 'font-bold' : 'font-bold'}`}>
                              {userPins?.filter((img) => img.board === board?.title).length === 0 ? (
                                <div class='bg-neutral-200 w-[50px] h-[50px] rounded-full flex items-center justify-center'>
                                  <ImageIcon classes={'w-5 h-5'} fill={'placeholders'} />
                                </div>
                              ) : (
                                <img
                                  class='w-[50px] h-[50px] rounded-full object-cover'
                                  src={userPins?.filter((img) => img?.board === board?.title)[0]?.img_url}
                                />
                              )}
                              <span class='pl-[10px]'>{board?.title}</span>
                            </div>
                            <span className={`absolute inset-y-0 left-[0] flex items-center flex w-full justify-end text-red`}>
                              {verifyBoard(board)}

                              {/* {currIndex === i && (
                                <Button
                                  background={selected ? 'bg-red' : 'bg-neutral-200'}
                                  color={selected ? 'text-white' : 'text-black'}
                                  hover={'hover:bg-neutral-900 hover:text-white'}
                                  // onClickAction={updatePin}
                                  classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 mr-[1rem]'}
                                >
                                  {selected === board?.title ? 'Saved' : 'Select'}
                                </Button>
                              )} */}
                            </span>{' '}
                          </div>
                        )}
                      </Listbox.Option>
                    );
                  })}
              </div>
              <div class='flex items-center justify-center w-full h-[28%] border-t border-solid border-inputGray bg-transparent  '>
                <div class='bg-red w-9 h-9 rounded-full flex items-center justify-center '>
                  <button
                    class='bg-red w-6 h-6 rounded-full flex items-center justify-center  cursor-pointer '
                    onClick={openModal}
                    alt='Create Board'
                  >
                    <AddIcon fill={'white'} class='cursor-pointer' />
                  </button>
                </div>
              </div>
            </div>
          </Listbox.Options>
        </Transition>
        <div>
          <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Create Board'} modalHeight={'h-[30vh]'}>
            <CreateBoard />
          </Modal>
        </div>
      </div>
    </Listbox>
  );
};

export default BoardsMenu;
