import React, { Fragment, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import FooterNavbar from './FooterNavbar';
import Modal from './UI/Modal';
import { css } from '@emotion/react';
import HashLoader from 'react-spinners/HashLoader';
import CreateBoard from './CreateBoard';
import { db, useAuthState } from '../firebase/config';

import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

//layout for entire app

const Layout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  let [color, setColor] = useState('#E53132');
  const [toggleModal, setToggleModal] = useState(false);
  //css for loader animation
  const [count, setCount] = useState();

  const override = css`
    display: block;
    margin: 0 auto;
    padding: 4rem 0 0 0;
    border-color: red;
  `;

  //time interval for loading animation

  useEffect(() => {
    const isLoading = () => {
      setTimeout(() => {
        setLoading({ loading: false });
      }, 3000);
    };
    isLoading();
  }, [count]);

  // loads component once loader animation stops making loading state is false

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => [setToggleModal(false)];

  return (
    <Fragment>
      {loading === true ? (
        <div
          style={{
            display: 'flex',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HashLoader color={color} loading={loading} css={override} size={50} />
        </div>
      ) : (
        <div>
          <Navbar />
          <div
            class={`w-full  h-[89vh] flex flex-col items-center overflow-scroll ${
              location.pathname.includes('/create') ? 'bg-inputGray' : location.pathname.includes('/edit') ? 'bg-inputGray' : 'bg-white'
            }`}
          >
            {' '}
            <Outlet />
          </div>
          <FooterNavbar openModal={openModal} />

          <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Create Board'}>
            <CreateBoard landing={'/'} />
          </Modal>
        </div>
      )}
    </Fragment>
  );
};

export default Layout;
