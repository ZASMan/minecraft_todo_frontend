import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import './Auth.css'; // Import the CSS file for styling

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Signed in user:', user.email);
      navigate('/', { state: { successMessage: `Welcome ${user.email}!` } });
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle sign-in error
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignIn} className="auth-form">
        <h2>Sign In</h2>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="button-group">
            <button type="submit" className='submit-button'>Sign In</button>
            <button type="button" className='auth-redirect-button' onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
        </div>
        {location.state?.successMessage && (
          <Alert variant="success">{location.state.successMessage}</Alert>
        )}
      </form>
    </div>
  );
};

export default Signin;
