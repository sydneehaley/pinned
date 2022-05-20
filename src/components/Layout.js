import React, { Fragment, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import FooterNavbar from './FooterNavbar';
import Modal from './UI/Modal';
import CreateBoard from './CreateBoard';

// This is the layout component wrapper for the entire app.

const Layout = () => {
  // State hooks that handle to toggle state of the 'Create Board' button from FooterNavbar menu
  const [toggleModal, setToggleModal] = useState(false);

  // Functions that setState that toggles modal.

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  /* 

App's layout. Using the outlet component from React Router 6 that renders a route's children.
Footer navbar are the buttons near the bottom of the page that render Create Board/Pin menu and Help menu.
Create Board component opens in modal. (Line 41)

  */

  return (
    <Fragment>
      <div>
        <Navbar />
        <div class={`w-full flex flex-col items-center `}>
          <Outlet />
        </div>

        <FooterNavbar openModal={openModal} />

        <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Create Board'} modalHeight={'h-[30vh]'}>
          <CreateBoard landing={'/'} />
        </Modal>
      </div>
    </Fragment>
  );
};

export default Layout;
