import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate, Outlet } from 'react-router-dom';
import _ from 'lodash';
import Navbar from './components/Navbar';
import FooterNavbar from './components/FooterNavbar';
import Welcome from './components/Welcome';
import Layout from './components/Layout';
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
import Featured from './components/Featured';
import { useAuthState } from './firebase/config';

// This component protects specific routes from the public.

const ProtectedRoute = ({ children }) => {
  const { pathname } = useLocation();
  const { user } = useAuthState();

  return user === undefined ? <Navigate to='/signup' state={{ from: pathname }} replace /> : <Outlet />;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showNavbar, setShowNavbar] = useState(true);

  const { user } = useAuthState();

  useEffect(() => {
    console.log(loading);
    console.log('app loading...');

    if (user !== undefined || user === undefined) {
      console.log('data loaded');

      setTimeout(() => {
        setLoading(false);
        console.log('app loaded');
      }, 500);
    }

    if (location !== null) {
      if (location.pathname == '/signup') {
        setShowNavbar(false);
      }
    }

    console.log(showNavbar);
  }, [user]);

  let location = useLocation();
  let background = location.state && location.state.background;

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
        <div></div>
      ) : (
        <div>
          <Navbar />
          <Routes location={background || location}>
            <Route path='/signup' element={<Welcome />} />

            {/* {users?.map((user) => (
            <Route exact path={'/' + user.displayName} element={<div>Public profile</div>} />
          ))} */}

            <Route path='/*' element={<ProtectedRoute />}>
              <Route path='' element={<Gallery />} />
              <Route path='featured' element={<Featured />} />
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
          {showNavbar === true && <FooterNavbar />}
        </div>
      )}{' '}
    </div>
  );
};

export default App;
