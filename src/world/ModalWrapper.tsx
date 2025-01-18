import React, { useEffect, ReactNode } from "react";
import { useComponentStore } from "../stores/ZustandStores";

interface ModalWrapperProps {
  children: ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children }) => {
  const {
    isSettingsModalOpen,
    isInfoModalOpen,
    isTermsModalOpen,
    isContactModalOpen,
  } = useComponentStore();

  useEffect(() => {
    const scrollY = window.scrollY;
    const joystickZone = document.getElementById("joystickZone");
    const isAnyModalOpen =
      isSettingsModalOpen ||
      isInfoModalOpen ||
      isTermsModalOpen ||
      isContactModalOpen;

    if (isAnyModalOpen) {
      if (joystickZone) {
        joystickZone.style.display = "none";
      }

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    }

    return () => {
      
        if (joystickZone) {
          joystickZone.style.display = "block";
        }

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        window.scrollTo(0, scrollY);
      
    };
  }, [isSettingsModalOpen, isInfoModalOpen, isTermsModalOpen, isContactModalOpen]);

  return <>{children}</>;
};

export default ModalWrapper;
