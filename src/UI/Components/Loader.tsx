import { useRef } from "react";
import React from "react";
import "./styles/loading-animation.css";

interface LoadProps {
  progress: number; 
}

const Load: React.FC<LoadProps> = ({ progress }) => {
  return (
    <div className="loader-background">
      <div className="loader-container-container">
        <div className="loader-container" id="loaderContainer">
          {/* Logo and Title Section */}
          <div className="loader-header">
            <img
              src="logo.avif"
              alt="Strategy Fox"
              className="powered-by-loader"
            />
            <div className="loading-text">Delta XR</div>
          </div>

          {/* Spinner Section */}
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          {/* Progress Section */}
          <div className="progress-section">
            <div className="progress-text">Loading Experience</div>
            <div className="progress-percentage">{Math.round(progress)}%</div>
          </div>
        </div>
        <div 
          className="loading-line"
          style={{ 
            transform: `scaleX(${progress / 100})`,
            backgroundPosition: `${progress}% 0%`
          }}
        />
      </div>
    </div>
  );
};

export default Load;
