import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { PersonFill } from 'react-bootstrap-icons';
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
// Pages
import Home from "./components/Home";
import Lists from "./components/Lists";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import EditList from "./components/EditList";
import ForgotPassword from "./components/ForgotPassword";
import NewPasswordConfirmation from "./components/NewPasswordConfirmation";
// Components
import Layout from './components/Layout';
import AlertMessage from './components/AlertMessage';

function App() {
  const [authUser, setAuthUser] = useState(null);
  const [signOutEmail, setSignOutEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user ? user : null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (authUser) {
      const email = authUser.email;
      setSignOutEmail(email);

      try {
        await auth.signOut();
        setAuthUser(null);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 5000);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  const ForgotPasswordRoute = ({ children }) => {
    return !authUser ? children : <Navigate to="/" />;
  };
  
const PasswordResetRoute = ({ children }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const oobCode = queryParams.get('oobCode');
  
  console.log("OOB Code:", oobCode); // Add this line for debugging

  return oobCode ? children : <Navigate to="/signin" />;
};


  return (
    <Router>
      <Layout isAuthenticated={authUser !== null}>
        <div className="App background-img">
          <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded}>
            <Container>
              <Navbar.Brand as={Link} to="/" className="navbar-brand" onClick={() => setExpanded(false)}>
                TodoCraft
              </Navbar.Brand>
              <Navbar.Toggle onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto links">
                  <Nav.Link as={Link} to="/lists" onClick={() => setExpanded(false)}>Lists</Nav.Link>
                  <Nav.Link as={Link} to="/dashboard" onClick={() => setExpanded(false)}>Dashboard</Nav.Link>
                </Nav>
                <Nav>
                  {authUser ? (
                    <div className="d-flex align-items-center">
                      <Nav.Link className="user-icon" title={authUser.email}>
                        <PersonFill size={20} />
                      </Nav.Link>
                      <Nav.Link className="signout-link" onClick={handleSignOut}>
                        Sign Out
                      </Nav.Link>
                    </div>
                  ) : (
                    <>
                      <Nav.Link as={Link} to="/signin" onClick={() => setExpanded(false)}>Sign In</Nav.Link>
                      <Nav.Link as={Link} to="/signup" onClick={() => setExpanded(false)}>Sign Up</Nav.Link>
                    </>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <AlertMessage
            variant="warning"
            message={`${signOutEmail} signed out!`}
            show={showAlert}
            onClose={() => setShowAlert(false)}
          />

          <main className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/forgot-password" element={<ForgotPasswordRoute><ForgotPassword /></ForgotPasswordRoute>} />
              <Route path="/reset-password" element={<PasswordResetRoute><NewPasswordConfirmation /></PasswordResetRoute>} />
              <Route path="/lists" element={<PrivateRoute authenticated={authUser !== null} redirect="/signin" element={<Lists authUser={authUser} />} />} />
              <Route path="/lists/edit/:listId" element={<PrivateRoute authenticated={authUser !== null} redirect="/signin" element={<EditList authUser={authUser} />} />} />
              <Route path="/dashboard" element={<PrivateRoute authenticated={authUser !== null} redirect="/signin" element={<Dashboard authUser={authUser} />} />} />
              <Route path="/signin" element={authUser ? <Navigate to="/" replace /> : <Signin />} />
              <Route path="/signup" element={authUser ? <Navigate to="/" replace /> : <Signup />} />
            </Routes>
          </main>

          <footer className="bg-dark footer">
            <p>&copy; {new Date().getFullYear()} Your App Name. All rights reserved.</p>
          </footer>
        </div>
      </Layout>
    </Router>
  );
}

export default App;
