import React, { useState, useEffect } from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay on initial page load
    const handleLoading = () => {
      if (process.env.NODE_ENV === 'development') {
        setLoading(true);
        const delay = setTimeout(() => setLoading(false), 500); // 0.5-second delay for spinner
        return () => clearTimeout(delay);
      } else {
        setLoading(false); // In production, assume loading is instant
      }
    };

    handleLoading(); // Trigger spinner on initial page load
  }, []);

  if (loading) {
    return (
      <div className="spinner">
        <div className="spinner-block"></div>
        <p className="loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-content">
      {children}
    </div>
  );
};

export default Layout;
