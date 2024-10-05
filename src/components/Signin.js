import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import AlertMessage from './AlertMessage';
import './Auth.css';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setShowError(false); // Reset the error alert visibility

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Signed in user:', user.email);
      navigate('/', { state: { successMessage: `Welcome ${user.email}!` } });
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage('Incorrect email or password. Please try again.'); // Set the error message
      setShowError(true); // Show the error alert
    }
  };

  // Timeout to hide error message after 5 seconds
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false); // Hide the error message after 5 seconds
      }, 5000);

      // Clear the timer when component unmounts or when showError changes
      return () => clearTimeout(timer);
    }
  }, [showError]);

  return (
    <>
      <AlertMessage
        variant="danger"
        message={errorMessage}
        show={showError}
        onClose={() => setShowError(false)}
      />
      <div className="auth-container">
        <form onSubmit={handleSignIn} className="auth-form">
          <h2>Sign In</h2>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p>
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
            <div className="button-group">
              <button type="submit" className="submit-button">Sign In</button>
              <button type="button" className="auth-redirect-button" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          </div>
        </form>
        <div class="fb-login-button" 
          data-width="1" 
          data-size="medium" 
          data-button-type="login_with" 
          data-layout="" 
          data-auto-logout-link="true" 
          data-use-continue-as="false"> 
        </div>
      </div>
    </>
  );
};

export default Signin;
