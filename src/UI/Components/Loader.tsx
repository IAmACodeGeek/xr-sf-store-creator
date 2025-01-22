import { useEffect, useRef } from "react";
import React from "react";
import "./loading-animation.css";

interface LoadProps {
  progress: number;
  showLoader: boolean;
}

const Load: React.FC<LoadProps> = ({ progress, showLoader }) => {
  const prevProgress = useRef<number>(0);
  useEffect(() => {
    prevProgress.current = Math.ceil(Math.max(progress, prevProgress.current));
  }, [progress]);

  return (
    <div
      className={"loader-background " + ((prevProgress.current >= 100 && !showLoader) ? "hidden" : "")}
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
            <div className="loading-text">{prevProgress.current}%</div>
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
