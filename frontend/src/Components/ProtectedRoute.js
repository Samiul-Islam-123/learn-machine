// src/Components/ProtectedRoute.js
import React from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const ProtectedRoute = ({ path, element: Component }) => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in');
    }
  }, [isSignedIn, navigate]);

  return <Route path={path} element={isSignedIn ? <Component /> : null} />;
};

export default ProtectedRoute;
