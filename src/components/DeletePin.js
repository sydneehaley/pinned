import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useParams } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, deleteField } from 'firebase/firestore';
import { db, useAuthState } from '../firebase/config';

const DeletePinForm = () => {
  const { user } = useAuthState();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [data, setData] = useState();
  const [toggleModal, setToggleModal] = useState(true);

  const docRef = doc(db, 'users', `${user?.uid}`, 'content', 'pins');
  const globalRef = doc(db, 'content', 'pins');

  useEffect(() => {
    const unsub = onSnapshot(docRef, (doc) => {
      console.log('Current data: ', doc?.data());
      const res = doc?.data();
      console.log(res);
      setData(res);
      console.log('data fetched');
    });

    return unsub;
  }, []);

  const pin_id = id;

  const deleteFromUser = async () => {
    await updateDoc(docRef, {
      [pin_id]: deleteField(),
    });
  };

  const deleteFromGlobal = async () => {
    await updateDoc(globalRef, {
      [pin_id]: deleteField(),
    });
  };

  const handleModalToggle = () => {
    setToggleModal(!toggleModal);
  };

  const handleOnClick = async (e) => {
    e.preventDefault();
    deleteFromGlobal();
    deleteFromUser();
    handleModalToggle();
  };

  return (
    <div>
      <p>
        <h1>Delete this pin?</h1>
        <button onClick={handleOnClick}>delete</button>
      </p>
    </div>
  );
};

export default DeletePinForm;
