import React, { useState } from 'react';
import { getAuth, confirmPasswordReset } from 'firebase/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';

function NewPasswordConfirmation() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode'); // Get the reset code from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const auth = getAuth();

    try {
      await confirmPasswordReset(auth, oobCode, password);
      navigate('/signin'); // Redirect to sign-in after success
    } catch (error) {
      setError('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="new-password-container">
      <h2>Enter New Password</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default NewPasswordConfirmation;
