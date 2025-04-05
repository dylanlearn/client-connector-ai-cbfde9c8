
import React from 'react';
import { Navigate } from 'react-router-dom';

// This page is just a redirect to the Index page
const Home = () => {
  return <Navigate to="/" replace />;
};

export default Home;
