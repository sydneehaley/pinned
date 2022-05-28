import React, { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { db, useAuthState } from '../firebase/config';
import { doc, updateDoc, onSnapshot, setDoc } from 'firebase/firestore';
import Button from './UI/Button';

const CreateBoard = ({ title, landing }) => {
  const { user, users } = useAuthState();
  const userRef = doc(db, 'public_users', `${user?.uid}`);
  const [board, setBoard] = useState(() => {
    return {
      id: '',
      public: true,
      author: user?.uid,
      public_author: user?.displayName,
      title: '',
      description: '',
      type: 'board',
      saved: false,
      own: true,
    };
  });
  const [boardCount, setBoardCount] = useState();
  const [formSuccess, setFormSuccess] = useState({
    successful: false,
    message: '',
  });

  let navigate = useNavigate();

  const createId = useId();

  useEffect(() => {
    setBoard({
      ...board,
      id: createId,
    });

    setBoardCount(users?.filter((usr) => usr.uid === user?.uid)[0]?.boards_count);

    setTimeout(() => {
      if (formSuccess.successful === true) {
        setFormSuccess({ successful: false });
      }
    }, 3000);
  }, []);

  const handleOnChange = (e) => {
    setBoard((board) => ({
      ...board,
      [e.target.name]: e.target.value,
    }));
  };

  const addBoard = async () => {
    const contentRef = doc(db, 'content', `${board?.id}`);
    await setDoc(contentRef, { ...board });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    addBoard();
    setFormSuccess({ successful: true, message: 'Board Added!' });
    if (landing != '') {
      navigate(landing, { replace: true });
    }
  };

  console.log(formSuccess.successful);

  return (
    <div class='w-full'>
      {formSuccess.successful === true ? (
        <div>{formSuccess.message}</div>
      ) : (
        <form class='flex flex-col'>
          <input
            class={`${
              title === ''
                ? 'border-b border-solid border-placeholders border-t-0 border-l-0 border-r-0 focus:ring-0 focus:outline-0 focus:border-blue-500'
                : 'border-b-0 border-t-0 border-l-0 border-r-0 border-solid focus:ring-0  focus:border-blue-500 focus:outline-0'
            } w-full m-0  pl-0  text-[36px] font-bold text-black placeholder:text-placeholders  focus:border-b-2`}
            placeholder='Title'
            onChange={handleOnChange}
            name='title'
            value={board?.title}
          />
          <input
            class='flex font-medium w-full focus:ring-0 focus:outline-0 focus:border-blue-500 focus:border-b-2 border-placeholders border-b-1 border-t-0 border-l-0 border-r-0 border-solid pl-0 pr-0 py-[0.5rem] placeholder:text-light_placeholders placeholder:font-normal placeholder:text-[1rem]'
            placeholder='Description'
            onChange={handleOnChange}
            name='description'
            value={board?.description}
          />
          <div class='pt-[2rem] pb-[1rem] w-full flex items-center justify-end'>
            <Button
              background={'bg-neutral-200'}
              hover={'hover:bg-black hover:text-white'}
              classes={'py-[12px] px-[1rem] min-h-[48px] min-w-[60px] outline-0 '}
              onClickAction={handleOnSubmit}
            >
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateBoard;
