import React, { useEffect, useState, Fragment } from 'react';
import { Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';
import _ from 'lodash';
import FooterNavbar from './components/FooterNavbar';
import SignIn from './components/SignIn';
import Welcome from './components/Welcome';
import Modal from './components/UI/Modal';
import CreateBoard from './components/CreateBoard';
import Gallery from './components/Gallery';
import Board from './components/Board';
import UserProfile from './components/UserProfile';
import PublicUserProfile from './components/PublicUserProfile';
import CreatePin from './components/CreatePin';
import PinView from './components/PinView';
import PinViewModalSearch from './components/PinViewModalSearch';
import PinViewModal from './components/PinViewModal';
import DeletePin from './components/DeletePin';
import Settings from './components/Settings';
import SearchResults from './components/SearchResults';
import Error from './components/Error';
import Stories from './components/Stories';
import { useAuthState } from './firebase/config';

// This component protects specific routes from the public.

const ProtectedRoute = () => {
  const { pathname } = useLocation();
  const { user } = useAuthState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(user);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return user == undefined ? <Navigate to='/signin' state={{ from: pathname }} replace /> : <Outlet />;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);
  const [toggleModal, setToggleModal] = useState(false);
  const { user } = useAuthState();

  useEffect(() => {
    console.log('app loading...');

    if (user !== undefined || user == undefined) {
      setTimeout(() => {
        setLoading(false);
        console.log('app loaded');
      }, 500);
    }

    if (user == null) {
      setShowNavbar(false);
    }
  }, [user]);

  let location = useLocation();
  let background = location.state && location.state.background;

  const openModal = () => {
    setToggleModal(true);
  };

  const closeModal = () => {
    setToggleModal(false);
  };

  /* 

App routes component is returned. Routes component includes location 
prop that sets location data for each route. That location being the 
background state set in the variable above or location without 
background state (modal view). Components that are not wrapped in 
ProtectedRoute component are viewable without a user being authenticated.

Line 172 creates a public user profile route so that all user's profiles are
able to be viewed without having a user account. Public route is generated from 
an array that contains all users data, creating a route with user's username.
  
Lines 219 and 225 create the route for modal views of pins from the home gallery
view and the search results view.

*/

  return (
    <div>
      {loading === true ? (
        <div>{null}</div>
      ) : (
        <div>
          <Routes location={background || location}>
            <Route path='/signup' element={<Welcome />} />
            <Route path='/signin' element={<SignIn />} />
            {/* {users?.map((user) => (
            <Route exact path={'/' + user.displayName} element={<div>Public profile</div>} />
          ))} */}
            <Route path='/*' element={<ProtectedRoute />}>
              <Route path='' element={<Gallery />} />
              <Route path='stories' element={<Stories />} />
              <Route exact path='delete/pin/:id' element={<DeletePin />} />
              <Route exact path='settings' element={<Settings />} />
              <Route exact path='view/pin/:id' element={<PinView />} />
              <Route exact path='search/view/pin/:id' element={<PinView />} />
              <Route exact path='create/pin' element={<CreatePin />} />
              <Route exact path='profile' element={<UserProfile />} />
              <Route path='boards/:id' element={<Board />} />
              <Route path='search/*' element={<SearchResults />} />
              <Route path='*' element={<Error />} />
            </Route>
          </Routes>

          {background && (
            <Routes>
              <Route path='/*' element={<ProtectedRoute />}>
                <Route path='search/view/pin/:id' element={<PinViewModalSearch />} />
              </Route>
            </Routes>
          )}

          {background && (
            <Routes>
              <Route path='/*' element={<ProtectedRoute />}>
                <Route path='view/pin/:id' element={<PinViewModal />} />
              </Route>
            </Routes>
          )}

          {showNavbar === true && (
            <div>
              <FooterNavbar openModal={openModal} />
            </div>
          )}

          <Modal isOpen={toggleModal} closeModal={closeModal} openModal={openModal} title={'Create Board'} modalHeight={'h-[30vh]'}>
            <CreateBoard landing={'/'} />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default App;
