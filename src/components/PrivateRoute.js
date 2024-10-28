import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element, redirect }) => {
  const { authUser } = useAuth();

  return authUser ? element : <Navigate to={redirect} replace />;
};

export default PrivateRoute;
