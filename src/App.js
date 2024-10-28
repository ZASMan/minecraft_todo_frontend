import { useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { signOut, auth } from './firebase'; // Import the signOut function
import { PersonFill } from 'react-bootstrap-icons';
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";
// Pages
import Home from "./pages/Home";
import Lists from "./pages/Lists";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EditList from "./pages/EditList";
import ForgotPassword from "./pages/ForgotPassword";
import NewPasswordConfirmation from "./pages/NewPasswordConfirmation";
// Components
import Layout from './pages/Layout';
import AlertMessage from './components/AlertMessage';


function App() {
  const { authUser, setAuthUser } = useAuth(); // This should now work without error
  const [signOutEmail, setSignOutEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSignOut = async () => {
    if (authUser) {
      const email = authUser.email;
      setSignOutEmail(email);
  
      try {
        await signOut(auth); // Use signOut(auth) instead of auth.signOut()
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

  useEffect(() => {
    console.log('Current authUser:', authUser); // Log authUser whenever it changes
  }, [authUser]);
  
  return (
    <Router>
      <Layout isAuthenticated={authUser !== null}>
        <div className="App background-img">
          <Navbar sticky="top" bg="dark" variant="dark" expand="lg" expanded={expanded}>
            <Container fluid>
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
              <Route path="/lists" element={<PrivateRoute redirect="/signin" element={<Lists />} />} />
              <Route path="/lists/edit/:listId" element={<PrivateRoute redirect="/signin" element={<EditList />} />} />
              <Route path="/dashboard" element={<PrivateRoute redirect="/signin" element={<Dashboard />} />} />
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
