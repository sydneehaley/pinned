import React from 'react';
import { Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import Welcome from './components/Welcome';
import Layout from './components/Layout';
import Gallery from './components/Gallery';
import Board from './components/Board';
import UserProfile from './components/UserProfile';
import PublicUserProfile from './components/PublicUserProfile';
import CreatePin from './components/CreatePin';
import CreateBoard from './components/CreateBoard';
import EditBoard from './components/EditBoard';
import PinView from './components/PinView';
import PinViewModalSearch from './components/PinViewModalSearch';
import PinViewModal from './components/PinViewModal';
import EditPin from './components/EditPin';
import DeletePin from './components/DeletePin';
import Settings from './components/Settings';
import SearchResults from './components/SearchResults';
import Error from './components/Error';
import Featured from './components/Featured';
import Modal from './components/UI/Modal';
import { useAuthState } from './firebase/config';

// This component protects specific routes from the public.

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  const { isAuthenticated } = useAuthState();

  /* 

If user is authenticated, route is displayed. Previous location is stored
in location state so user can return to route they were at before logging in 

*/

  if (!isAuthenticated) {
    return <Navigate to='/signup' state={{ from: location }} replace />;
  }

  // Children prop returns all routes nested under Protected Route component

  return children;
};

// This component contains Routes wrapper component for the app's routes.

const App = () => {
  // This variable gets all users data from context component from the custom app state hook.

  const { users } = useAuthState();

  /* 

Variables created for useLocation hook (React Router) and for background location state. 
The background location is need to display content in a modal view that sets a background location/view.

*/

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
      <Routes location={background || location}>
        <Route exact path='/signup' element={<Welcome />} />
        <Route element={<Layout />}>
          <Route
            exact
            path='/'
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path='/featured'
            element={
              <ProtectedRoute>
                <Featured />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            exact
            path='/delete/pin/:id'
            element={
              <ProtectedRoute>
                <DeletePin />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            exact
            path='/settings'
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/view/pin/:id'
            element={
              <ProtectedRoute>
                <PinView />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path='/search/view/pin/:id'
            element={
              <ProtectedRoute>
                <PinView />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/edit/pin/:id'
            element={
              <ProtectedRoute>
                <EditPin />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/create/pin'
            element={
              <ProtectedRoute>
                <CreatePin />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path='/create/board'
            element={
              <ProtectedRoute>
                <CreateBoard />
              </ProtectedRoute>
            }
          />

          <Route
            exact
            path='/edit/board/:id'
            element={
              <ProtectedRoute>
                <EditBoard />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path='/myprofile'
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          {users?.map((user) => (
            <Route exact path={'/' + user.displayName} element={<PublicUserProfile />} />
          ))}

          <Route
            path='/boards/:id/:title'
            element={
              <ProtectedRoute>
                <Board />
              </ProtectedRoute>
            }
          />
          <Route
            path='/search/*'
            element={
              <ProtectedRoute>
                <SearchResults />
              </ProtectedRoute>
            }
          />
          <Route
            path='*'
            element={
              <ProtectedRoute>
                <Error />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/search/view/pin/:id'
            element={
              <ProtectedRoute>
                <PinViewModalSearch />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}

      {background && (
        <Routes>
          <Route
            path='/view/pin/:id'
            element={
              <ProtectedRoute>
                <PinViewModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
