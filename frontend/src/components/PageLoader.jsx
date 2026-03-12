import React from 'react';
import '../styles/components/loader.css';

export default function PageLoader() {
  return (
    <div className="page-loader-container">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <p className="loading-text">Loading...</p>
    </div>
  );
}
