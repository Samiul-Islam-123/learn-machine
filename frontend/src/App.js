import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage/LandingPage';
import MainUI from './Pages/MainUI/MainUI';
import SignInPage from './Pages/SignInPage';
import SignUpPage from './Pages/SignUpPage';
import { useUser } from '@clerk/clerk-react';

function App() {
  const { isSignedIn, user } = useUser();

  return (
    <>
    Hellow World
      <Routes>
        <Route exact path='/' element={<LandingPage />} />
        <Route exact path='/sign-in' element={<SignInPage />} />
        <Route exact path='/sign-up' element={<SignUpPage />} />
        <Route exact path='/app/*' element={isSignedIn ? <MainUI user = {user} /> : <Navigate to="/sign-in" />} />
      </Routes>
    </>
  );
}

export default App;
