import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Import the CSS file for styling

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('User signed up successfully!');
      setSuccessMessage('Sign-up successful!');
      navigate('/');
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle sign-up error
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignUp} className="auth-form">
        <h2>Sign Up</h2>
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
          <button type="submit">Sign Up</button>
        </div>
        {successMessage && <p>{successMessage}</p>}
      </form>
    </div>
  );
};

export default Signup;
