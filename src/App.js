import { Navbar, Nav, Alert } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
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
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand as={Link} to="/">
              Minecraft Todo
            </Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/lists">
                Lists
              </Nav.Link>
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav>
            <Nav>
              {authUser ? (
                <Nav.Link onClick={handleSignOut}>Sign Out</Nav.Link>
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
                  element={<Lists authUser={authUser} />} // Pass the authUser prop to Lists component
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute
                  authenticated={!!authUser}
                  redirect="/signin"
                  element={<Dashboard authUser={authUser} />} // Pass the authUser prop to Dashboard component
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
    </Router>
  );
}

export default App;
