import React from 'react';
import './MinecraftSpinner.css'; // Import CSS for the spinner

const MinecraftSpinner = () => {
  return (
    <div className="spinner">
      <div className="spinner-block"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default MinecraftSpinner;
