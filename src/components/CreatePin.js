import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCurrentPinInfo } from '../store/features/appState';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { db, useAuthState } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, onSnapshot, updateDoc, setDoc, collection, Timestamp } from 'firebase/firestore';
import { storage } from '../firebase/config';
import { css } from '@emotion/react';
import DotLoader from 'react-spinners/DotLoader';
import AddIcon from './UI/Icons/AddIcon';
import ArrowLeft from './UI/Icons/ArrowLeft';
import ArrowRight from './UI/Icons/ArrowRight';
import { Listbox, Transition, Switch } from '@headlessui/react';
import CreatePublishEditForm from './UI/CreatePublishEditForm';
import BoardsMenu from './UI/BoardsMenu';
import ChevronDownIcon from './UI/Icons/ChevronDownIcon';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import SearchIcon from './UI//Icons/SearchIcon';
import Modal from './UI/Modal';
import CreateBoard from './CreateBoard';

const people = [{ name: 'Photography' }, { name: 'Dogs' }, { name: 'Fashion' }, { name: 'Cats' }, { name: 'Tanya Fox' }, { name: 'Hellen Schmidt' }];

const CreatePin = () => {
  const { user, userBoards, users } = useAuthState();
  const userRef = doc(db, 'public_users', `${user?.uid}`);
  const [selectedBoard, setSelectedBoard] = useState(userBoards[0]);

  const [pin, setPin] = useState(() => {
    return {
      id: '',
      title: '',
      board: '',
      generalBoard: true,
      alt_tag: '',
      description: '',
      target: '',
      img_url: '',
      file_name: '',
      public: true,
      author: user?.uid,
      public_author: user?.displayName,
      timestamp: Timestamp.now(),
      preview: false,
      label: true,
      type: 'pin',
      // likes: {},
    };
  });

  const [pinCount, setPinCount] = useState();
  const [query, setQuery] = useState('');
  const [toggleSearch, setToggleSearch] = useState(false);
  const [toggleModal, setToggleModal] = useState(false);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const createId = uuidv4().slice(0, 8);
    setPin({ ...pin, id: createId });

    setPinCount(users?.filter((usr) => usr.uid === user?.uid)[0]?.pins_count);
  }, []);

  console.log(pinCount);
  console.log(pin);

  const handleOnChange = (e) => {
    setPin((pin) => ({
      ...pin,
      [e.target.name]: e.target.value,
    }));
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    if (file.size < 2e6 && file && file.type.substr(0, 5) === 'image') {
      console.log('file uploading...');
    } else {
      alert('File size is too big');
    }
    const metadata = {
      contentType: 'image/jpeg',
    };
    const storageRef = ref(storage, `${user?.uid}/pins/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            setLoading(true);
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          if (downloadURL) {
            setLoading(false);
          }
          setPin({
            ...pin,
            img_url: downloadURL,
            file_name: file.name,
            preview: true,
            label: false,
          });
        });
      }
    );
  };

  const addPin = async () => {
    const contentRef = doc(db, `content`, `${pin?.id}`);
    await setDoc(contentRef, { ...pin });
  };

  const handleBoardChange = (newSelection) => {
    setSelectedBoard(newSelection);
    setPin({ ...pin, board: newSelection?.title });
    // dispatch(getBoardSelection(selected));
  };

  const handleBoardSearchOnChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    addPin();
    navigate('/', { replace: true });
  };

  console.log(selectedBoard?.title);
  console.log(pin?.board);

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };
  console.log(toggleModal);
  return (
    <CreatePublishEditForm
      submitText={'Save'}
      pinImg={pin?.img_url}
      onFileChange={onFileChange}
      inputOnChange={handleOnChange}
      handleOnSubmit={handleOnSubmit}
      title={pin?.title}
      formTitle={'Create Pin'}
      preview={pin?.preview}
      label={pin?.label}
      loader={loading}
    >
      <Listbox value={selectedBoard} onChange={handleBoardChange} as='div'>
        <div className='relative m-0'>
          <div class='relative flex w-full justify-end items-end'>
            <Listbox.Button className='bg-neutral-200 px-[14px] max-w-[10rem] min-w-[10rem] max-h-[40px] rounded-tl-lg rounded-bl-lg w-full py-[14px] cursor-default flex items-center focus:outline-0'>
              <span class='font-bold text-neutral-600 w-1/2 flex justify-start'>{selectedBoard?.title}</span>
              <span class='w-1/2 flex justify-end'>
                <ChevronDownIcon fill={'none'} classes={'text-medium_gray w-4 h-4 stroke-neutral-600 '} />
              </span>
            </Listbox.Button>
          </div>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options className='absolute w-[18rem] -left-[50%] p-0 mt-[1rem] overflow-auto text-base bg-white  rounded-md shadow-lg h-[22rem] ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              <div class='h-[30%] px-4'>
                <h6 class='font-bold pb-[1rem] pt-[1rem] flex items-center justify-start'>Save to boards</h6>

                <div class='absolute h-[50px] flex items-center left-[30px]'>
                  <SearchIcon classes={'w-4 h-4 fill-neutral-500 '} fill={'neutral-400'} />
                </div>

                <input
                  class='border-inputGray border-2 w-full rounded-full h-[50px] focus:outline-0 pl-[2.5rem] '
                  value={query}
                  onChange={handleBoardSearchOnChange}
                  onClick={() => setToggleSearch(!toggleSearch)}
                />
              </div>
              <div class='h-[70%]'>
                <div class='h-[70%] overflow-x-scroll p-4'>
                  <h6 class='font-md pt-[1rem] pb-[0.5rem] text-xs'>All Boards</h6>
                  {userBoards
                    ?.filter((board) => {
                      if (query == '') {
                        return userBoards;
                      } else if (board?.toLowerCase().includes(query)) {
                        return board;
                      }
                    })
                    .map((board, i) => {
                      return (
                        <Listbox.Option
                          key={i}
                          className={({ active }) =>
                            `cursor-default select-none relative py-2 pr-4 focus:outline-0 pl-[0.5rem]  ${
                              active ? 'text-black bg-lightest_gray' : 'text-black'
                            }`
                          }
                          name='title'
                          value={board}
                        >
                          {({ selected }) => (
                            <>
                              <span className={`block truncate  ${selected ? 'font-bold' : 'font-bold'}`}>{board.title}</span>
                              {selected ? (
                                <span className='absolute inset-y-0 left-[0] flex items-center flex w-full justify-end text-red pr-[10px]'>
                                  <CheckIcon className='w-5 h-5' aria-hidden='true' />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      );
                    })}
                </div>
                <div class='flex items-center justify-center w-full h-[30%] border-t border-solid border-inputGray bg-transparent  '>
                  <button class='bg-red w-9 h-9 rounded-full flex items-center justify-center  cursor-pointer ' onClick={openModal}>
                    <AddIcon stroke={'white'} class='cursor-pointer' />
                  </button>
                </div>
              </div>
            </Listbox.Options>
          </Transition>
          <div>
            <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Create Board'}>
              <CreateBoard />
            </Modal>
          </div>
        </div>
      </Listbox>
    </CreatePublishEditForm>
  );
};

export default CreatePin;
