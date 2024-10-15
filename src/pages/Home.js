import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AlertMessage from '../components/AlertMessage';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import './Home.css';
import mcWaterDragonImage from '../assets/mc-water-dragon.png';
import cuteHomeImage from '../assets/cute-home.png';
import minecraftChurchImage from '../assets/minecraft-church.png';
import Section from '../components/Section'; // Import the Section component

const Home = () => {
  const location = useLocation();
  const successMessage = location?.state?.successMessage;
  const [showMessage, setShowMessage] = useState(!!successMessage);
  
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
      <AlertMessage
        variant="success"
        message={successMessage}
        show={showMessage}
        onClose={() => setShowMessage(false)}
      />

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
                <Button className="sign-button-home" variant="primary" href="/signin">Sign In</Button>
                <Button className="sign-button-home" variant="secondary" href="/signup">Sign Up</Button>
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

      <div className="tutorial-container">
        <Section>
          <h2 className='step-header'>What is TodoCraft?</h2>
          <p className='step-content'>TodoCraft is a task management app inspired by the popular game Minecraft. It allows you to create, edit, and delete tasks. You can also mark tasks as completed and filter them by status. TodoCraft is designed to help you organize your tasks and projects in a fun and interactive way.</p>
        </Section>

        <Section>
          <h4 className='step-header'>Step 1: Sign In</h4>
          <p className='step-content'>Just sign in or create an account. Once you're logged in, you can start creating and managing your tasks.</p>
        </Section>

        <Section>
          <h4 className='step-header'>Step 2: Go to the Lists Tab</h4>
          <p className='step-content'>Go to the lists tab. Make sure to fill out a title and description before adding todo items. This helps keep everything organized.</p>
        </Section>

        <Section>
          <h4 className='step-header'>Step 3: Use the Dashboard</h4>
          <p className='step-content'> Head over to the dashboard to review, check off, edit, or delete your todo lists. Keep track of your progress easily!</p>
        </Section>
      </div>
    </>
  );
};

export default Home;
