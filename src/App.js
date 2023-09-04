import { Navbar, Nav, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { PersonFill } from 'react-bootstrap-icons'; // Import Bootstrap icon
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
import Home from "./components/Home";
import Lists from "./components/Lists";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = () => {
    console.log('User signed out:', authUser.email);
    auth.signOut();
    setAuthUser(null); // Clear the authUser state
  };

  return (
    <Router>
      <div className="App background-img">
        <>
          <Navbar bg="black" variant="dark">
            <Navbar.Brand className='navbar-brand' as={Link} to="/">
              TodoCraft
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link className='lists' as={Link} to="/lists">
                Lists
              </Nav.Link>
              <Nav.Link className='dashboard' as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav>
            <Nav>
              {authUser ? (
                <div className="d-flex align-items-center">
                  <Nav.Link className="user-icon" title={authUser.email}>
                    <PersonFill size={20} />
                  </Nav.Link>
                  <Nav.Link className="signout-link" onClick={handleSignOut}>Sign Out</Nav.Link>
                </div>
              ) : (
                <>
                  <Nav.Link as={Link} to="/signin">
                    Sign In
                  </Nav.Link>
                  <Nav.Link as={Link} to="/signup">
                    Sign Up
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar>
          {showAlert && (
            <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
              {`${authUser ? authUser.email : ''} signed out!`}
            </Alert>
          )}
        </>

        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/lists"
              element={
                <PrivateRoute
                  authenticated={!!authUser}
                  redirect="/signin"
                  element={<Lists authUser={authUser} />}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute
                  authenticated={!!authUser}
                  redirect="/signin"
                  element={<Dashboard authUser={authUser} />}
                />
              }
            />
            <Route
              path="/lists/:listId" // Dynamic route for editing a list
              element={
                <PrivateRoute
                  authenticated={!!authUser}
                  redirect="/signin"
                  element={<Lists authUser={authUser} />} // Pass the authUser prop to TodoList component
                />
              }
            />
            <Route
              path="/signin"
              element={authUser ? <Navigate to="/" replace /> : <Signin />}
            />
            <Route
              path="/signup"
              element={authUser ? <Navigate to="/" replace /> : <Signup />}
            />
          </Routes>
        </div>
      </div>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Your App Name. All rights reserved.</p>
      </footer>
    </Router>
  );
}

export default App;
