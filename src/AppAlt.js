import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
import PinViewModal from './components/PinViewModal';
import EditPin from './components/EditPin';
import DeletePin from './components/DeletePin';
import Settings from './components/Settings';
import SearchResults from './components/SearchResults';
import Error from './components/Error';
import Featured from './components/Featured';
import Modal from './components/UI/Modal';
import { AuthContextProvider, useAuthState } from './firebase/config';

const ProtectedRoute = ({ children }) => {
  let location = useLocation();
  const { isAuthenticated } = useAuthState();

  if (!isAuthenticated) {
    return <Navigate to='/signup' state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  const { user, users } = useAuthState();
  const navigate = useNavigate();

  let location = useLocation();

  let background = location.state && location.state.background;
  // let gallery = location.state && location.state.gallery;

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
            path='view/pin/:id'
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
          <Route path='/view/pin/:id' element={<PinViewModal />} />
        </Routes>
      )}
    </div>
  );
};

export default AppAlt;
