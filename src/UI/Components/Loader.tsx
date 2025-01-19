import { useRef } from "react";
import React from "react";
import "./loading-animation.css";

interface LoadProps {
  progress: number; 
}

const Load: React.FC<LoadProps> = ({ progress }) => {

  return (
    <div
      className="loader-background"
    >
      <div className="loader-container-container">
        <div className="loader-container" id="loaderContainer">
          <div className="spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="loading-text-container">
            <div className="loading-text typewriter">Delta XR</div>
            <div className="loading-text">{Math.round(progress)}%</div>
          </div>
          <img
            id="powered-by-loader"
            src="logo.avif"
            alt="Powered By Strategy Fox"
            className="powered-by-loader"
          />
        </div>
        <div className="loading-line"></div>
      </div>
    </div>
  );
};

export default Load;
