import { useEffect, useRef, useState } from "react";
import { driver, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import styles from "@/UI/UI.module.scss";
import { useComponentStore, useDriverStore, useTourStore } from "../stores/ZustandStores";
import InfoModal from "@/UI/Components/InfoModal";
import SettingsModal from "@/UI/Components/SettingsModal";
import TermsConditionsModal from "@/UI/Components/TermsModal";
import ContactUsModal from "@/UI/Components/ContactUsModal";
import ReactAudioPlayer from "react-audio-player";
import ModalWrapper from "@/world/ModalWrapper";
import ProductSearcher from "@/UI/Components/ProductSearcher";
import { CreatorKit } from "./Components/CreatorKit";

const customDriverStyles = `
  .driver-popover {
    font-family: 'Poppins', sans-serif !important;
  }
  
  .driver-popover * {
    font-family: 'Poppins', sans-serif !important;
  }
  
  .driver-popover-title {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 600 !important;
    font-size: 18px !important;
  }
  
  .driver-popover-description {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 400 !important;
    font-size: 14px !important;
  }
  
  .driver-popover-progress-text {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 400 !important;
  }
  
  .driver-popover-footer button {
    font-family: 'Poppins', sans-serif !important;
    font-weight: 500 !important;
  }
`;

const UI = () => {
  const {
    isInfoModalOpen, closeInfoModal,
    isSettingsModalOpen , openSettingsModal, closeSettingsModal,
    isAudioPlaying,
    isTermsModalOpen,isContactModalOpen,
    isProductSearcherOpen,openProductSearcher,closeProductSearcher
  } = useComponentStore();

  const { activateDriver, deactivateDriver} = useDriverStore();
  const { setTourComplete } = useTourStore();

  const driverRef = useRef<Driver>(undefined);
  const audioPlayerRef = useRef<any>(null);
  const shouldMoveCamera = useRef(false);

  const [isMobile, setIsMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(
      navigator.userAgent
    )
  );

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = customDriverStyles;
    document.head.appendChild(styleSheet);

    driverRef.current = driver({
      showProgress: true,
      steps: [
        {
          element: ".iconsContainer",
          popover: {
            title: "Navigation & Controls",
            description: isMobile
              ? "Use the virtual joystick to move around and interact with products"
              : "Use WASD keys to navigate: W (up), A (left), S (down), D (right)",
            side: "left",
            align: "start",
          },
        },
        {
          popover: {
            title: "Find products across the experience",
            description: "Walk to these products to essentially buy or add them to cart, I'll drop you off for now!",
          },
          onHighlightStarted: () => {
            shouldMoveCamera.current = true; 
            setTourComplete(true);
          },
        },
        {
          element: '[alt="Settings"]',
          popover: {
            title: "Settings",
            description: "Manage your preferences, explore app features, and customize your experience.",
            side: "bottom",
          },
        },
      ],
    });

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [isMobile]);

  useEffect(() => {
    if(isAudioPlaying)
    {
      audioPlayerRef.current.audioEl.current.play();
    }
    else {
      audioPlayerRef.current.audioEl.current.pause();
    }
  },[isAudioPlaying])


  const startTour = () => {

    if (isInfoModalOpen) closeInfoModal();
    if (isSettingsModalOpen) closeSettingsModal();
    if (isProductSearcherOpen) closeProductSearcher();
 
    if (driverRef.current) {
      driverRef.current.drive();
      activateDriver(); 
    }
  };

  useEffect(() => {

    let lastState = driverRef.current?.isActive();
    const checkDriverState = () => {
      const currentState = driverRef.current?.isActive();
      if(currentState !== lastState){
        lastState = currentState;
        if (currentState) {
          activateDriver();
        } else {
          deactivateDriver();
        }
      }
    };

    const interval = setInterval(checkDriverState, 100);

    return () => clearInterval(interval);
  }, [activateDriver, deactivateDriver]);

  return (
    <div className="ui-root">
      <div className={styles.iconsContainer}>
        <img src="/icons/Search.svg" alt="Search" className={styles.icon} onClick={openProductSearcher} />
        <img src="/icons/Settings.svg"  alt="Settings" className={styles.icon} onClick={openSettingsModal} />
        <img src="/icons/Help.svg" alt="Help" className={styles.icon} onClick={startTour}/>
      </div>

      <CreatorKit/>
      {isInfoModalOpen && (
        <InfoModal></InfoModal>
      )}
      {isTermsModalOpen && (
        <TermsConditionsModal />
      )}
      {isContactModalOpen && (
        <ContactUsModal />
      )}
      {isSettingsModalOpen && <ModalWrapper><SettingsModal /></ModalWrapper>}
      {isProductSearcherOpen && <ProductSearcher></ProductSearcher>}
      <ReactAudioPlayer
          ref={audioPlayerRef}
          src="/media/Soundtrack.mp3" 
          autoPlay={false}
          loop
      />
    </div>
  );
};

export default UI;
