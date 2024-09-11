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
import EditList from "./components/EditList";

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [signOutEmail, setSignOutEmail] = useState('');
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

  const handleSignOut = async () => {
    if (authUser) {
      const email = authUser.email;
      setSignOutEmail(email); // Store email before signing out

      try {
        await auth.signOut();
        console.log('User signed out:', email);
        setAuthUser(null); // Clear the authUser state
        setShowAlert(true); // Show the alert
        setTimeout(() => setShowAlert(false), 5000); // Hide the alert after 5 seconds
      } catch (error) {
        console.error('Error signing out:', error);
        // Handle sign-out error
      }
    }
  };

  return (
    <Router>
      <div className="App background-img">
        <Navbar bg="dark" variant="dark">
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
            {`${signOutEmail} signed out!`} {/* Use the stored email */}
          </Alert>
        )}
        <main className="content">
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
              path="/lists/edit/:listId"
              element={
                <PrivateRoute
                  authenticated={!!authUser}
                  redirect="/signin"
                  element={<EditList authUser={authUser} />} // Component to edit a list by ID
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
        </main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </footer>    
      </div>
    </Router>
  );
}

export default App;
