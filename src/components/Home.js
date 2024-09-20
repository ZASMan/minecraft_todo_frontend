import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button'; // Import Button from react-bootstrap
import './Home.css';

import mcWaterDragonImage from '../assets/mc-water-dragon.png';
import cuteHomeImage from '../assets/cute-home.png';
import minecraftChurchImage from '../assets/minecraft-church.png';

const Home = () => {
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(true);
  const successMessage = location?.state?.successMessage;

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
      <Carousel>
        {/* First Slide */}
        <Carousel.Item>
          <div className="carousel-content">
            <img className="d-block w-100" src={mcWaterDragonImage} alt="First slide" />
            <div className="content">
              <h1>Welcome to TodoCraft</h1>
              <h3>Organize your adventure</h3>
              <p>Enjoy the soul-soothing satisfaction of TodoCraft's "leave-no-cobblestone-unturned" approach that ensures you have all the items needed for your projects.</p>
            </div>
          </div>
        </Carousel.Item>
        {/* Second Slide */}
        <Carousel.Item>
          <div className="carousel-content">
            <img className="d-block w-100" src={cuteHomeImage} alt="Second slide" />
            <div className="content">
              <h1>Sign In/Up</h1>
              <h3>Start organizing your adventure today!</h3>
              <div className="buttons">
                <Button className='sign-button-home' variant="primary" href="/signin">Sign In</Button>
                <Button className='sign-button-home' variant="secondary" href="/signup">Sign Up</Button>
              </div>
            </div>
          </div>
        </Carousel.Item>
        {/* Third Slide */}
        <Carousel.Item>
          <div className="carousel-content">
            <img className="d-block w-100" src={minecraftChurchImage} alt="Third slide" />
            <div className="content">
              <h1>Coming Soon!</h1>
              <h4>Working on a build with a friend? Try TCShare.</h4>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default Home;
