import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    const actionCodeSettings = {
      url: 'http://localhost:3000/reset-password', // URL where users will land after clicking the reset link.
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      setMessage('Password reset link has been sent to your email.');
    } catch (error) {
      setError('Error sending reset email. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handlePasswordReset}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default ForgotPassword;
