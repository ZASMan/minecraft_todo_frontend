import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ path, element, authenticated, redirect }) => {
  if (!authenticated) {
    return <Navigate to={redirect} replace />;
  }

  return element;
};

export default PrivateRoute;

