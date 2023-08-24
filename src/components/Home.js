import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import './Home.css';

const Home = () => {
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(true);
  const successMessage = location?.state?.successMessage; // Access successMessage using optional chaining

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {successMessage && showMessage && <Alert variant="success">{successMessage}</Alert>}
      <div className="homepage_content">
        <h1 className="home_h1">Welcome to Minecraft Todo</h1>
        <h4 className="home_h4">Start creating your lists for your builds now!</h4>
      </div>
    </>
  );
};

export default Home;
