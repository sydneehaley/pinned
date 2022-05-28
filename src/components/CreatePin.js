import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { db, useAuthState } from '../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { storage } from '../firebase/config';
import AddIcon from './UI/Icons/AddIcon';
import { Listbox, Transition } from '@headlessui/react';
import ImageIcon from './UI/Icons/ImageIcon';
import CreatePublishEditForm from './UI/CreatePublishEditForm';
import ChevronDownIcon from './UI/Icons/ChevronDownIcon';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import SearchIcon from './UI//Icons/SearchIcon';
import Modal from './UI/Modal';
import CreateBoard from './CreateBoard';

const people = [{ name: 'Photography' }, { name: 'Dogs' }, { name: 'Fashion' }, { name: 'Cats' }, { name: 'Tanya Fox' }, { name: 'Hellen Schmidt' }];

const CreatePin = () => {
  const { user, users, userBoards, userPins } = useAuthState();
  const [selected, setSelected] = useState(userBoards[0]);

  console.log(userBoards);

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
    setSelected(newSelection);
    setPin({ ...pin, board: newSelection?.title });
    // dispatch(getBoardSelection(selected));
  };

  const handleBoardSearchOnChange = (e) => {
    e.preventDefault();
    setQuery(e.target.value);
  };

  const debouncedChangeHandler = useCallback(debounce(handleBoardSearchOnChange, 500), []);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    addPin();
    navigate('/', { replace: true });
  };

  console.log(selected?.title);
  console.log(pin?.board);

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  const verifyBoard = (board) => {
    if (selected?.title) {
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
      <Listbox value={selected} onChange={handleBoardChange} as='div'>
        <div className='relative m-0'>
          <div class='relative flex w-full justify-end items-end'>
            <Listbox.Button className='bg-neutral-200 px-[14px] max-w-[10rem] min-w-[10rem] max-h-[40px] rounded-tl-lg rounded-bl-lg w-full py-[14px] cursor-pointer flex items-center focus:outline-0'>
              <span class='font-bold text-neutral-600 w-1/2 flex justify-start'>{selected?.title}</span>
              <span class='w-1/2 flex justify-end'>
                <ChevronDownIcon fill={'none'} classes={'text-medium_gray w-4 h-4 stroke-neutral-600 '} />
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
                          className={({ active }) =>
                            `cursor-pointer select-none relative  pl-0  rounded-xl ${active ? 'text-black' : 'text-gray-900'}`
                          }
                          name='title'
                          value={board}
                        >
                          {({ selected }) => (
                            <div
                              class={`h-[4rem] flex items-center rounded-lg hover:bg-neutral-100 ${
                                selected === board?.title ? 'bg-red' : 'bg-transparent'
                              }`}
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

          <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Create Board'} modalHeight={'h-[30vh]'}>
            <CreateBoard />
          </Modal>
        </div>
      </Listbox>
    </CreatePublishEditForm>
  );
};

export default CreatePin;
