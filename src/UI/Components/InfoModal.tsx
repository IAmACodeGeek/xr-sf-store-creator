import { X } from "lucide-react";
import { useComponentStore } from "../../stores/ZustandStores";

const styles = {
  backdrop: {
    position: "fixed" as "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(8px)",
    zIndex: 1050,
    overflowY: "hidden" as "hidden",
    touchAction: "none",
    pointerEvents: "auto",
  },
  modalContainer: {
    position: "relative" as "relative",
    backgroundColor: "#1f1f1f",
    borderRadius: "1rem",
    width: "80vw",
    height: "80vh",
    maxWidth: "36rem",
    maxHeight: "90vh",
    margin: "auto",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1100,
    border: "1px solid #333",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
    fontFamily: "'Poppins', sans-serif",
    display: "flex",
    flexDirection: "column" as "column",
    overflowY: "auto" as "auto",
    WebkitOverflowScrolling: "touch",
  },
  closeButton: {
    position: "absolute" as "absolute",
    top: "0.5rem",
    right: "0.5rem",
    padding: "0.5rem",
    borderRadius: "50%",
    background: "transparent",
    transition: "background-color 0.2s",
    zIndex: 1150,
    border: "none",
    cursor: "pointer",
  },
  closeIcon: {
    width: "1.25rem",
    height: "1.25rem",
    color: "#ccc",
  },
  title: {
    color: "white",
    fontSize: "1rem",
    fontWeight: 700,
    textAlign: "center" as "center",
    margin: "1rem 0",
    padding: "0 2rem",
  },
  content: {
    flex: 1,
    overflowY: "auto" as "auto",
    padding: "1rem",
    WebkitOverflowScrolling: "touch",
  },
  sectionTitle: {
    color: "white",
    fontSize: "1.125rem",
    fontWeight: 600,
    marginTop: "1rem",
    marginBottom: "0.75rem",
  },
  text: {
    color: "#ccc",
    fontSize: "0.9rem",
    lineHeight: 1.6,
    marginBottom: "0.75rem",
  },
  list: {
    paddingLeft: "1rem",
    marginBottom: "1rem",
  },
  listItem: {
    marginBottom: "0.65rem",
    color: "white",
    fontSize: "0.9rem",
  },
  divider: {
    height: "1px",
    backgroundColor: "#333",
    margin: "1rem 0",
  },
  button: {
    marginTop: "1rem",
    backgroundColor: "#4b4b4b",
    color: "white",
    padding: "0.6rem 1.2rem",
    borderRadius: "0.375rem",
    fontWeight: 500,
    fontFamily: "'Poppins', sans-serif",
    fontSize: "0.9rem",
    cursor: "pointer",
    textAlign: "center" as "center",
    transition: "background-color 0.2s",
    border: "none",
    width: "100%",
  },
  buttonHover: {
    backgroundColor: "#3a3a3a",
  },
  responsive: `
    @media (max-width: 768px) {
      .modalContainer {
        width: 90vw;
        height: 85vh;
        maxWidth: 32rem;
      }
    }
    @media (max-width: 480px) {
      .modalContainer {
        width: 95vw;
        height: 90vh;
        maxWidth: none;
        maxHeight: none;
        padding: 0.5rem;
      }
    }
  `,
};

const InfoModal = () => {
  const { isInfoModalOpen, closeInfoModal } = useComponentStore();


  const handleClose = () => {
    const joystickZone = document.getElementById("joystickZone");
    if (joystickZone) {
      joystickZone.style.display = "block";
    }
    closeInfoModal();
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
          ${styles.responsive}
          .modalContainer::-webkit-scrollbar {
            width: 8px;
          }
          .modalContainer::-webkit-scrollbar-track {
            background: #1f1f1f;
          }
          .modalContainer::-webkit-scrollbar-thumb {
            background: #4b4b4b;
            border-radius: 4px;
          }
          .modal-open {
            overflow: hidden !important;
            touch-action: none !important;
          }
        `}
      </style>
      <div 
        style={styles.backdrop} 
        onClick={handleClose}
      >
        <div
          className="modalContainer"
          style={styles.modalContainer}
        >
          <button
            onClick={handleClose}
            style={styles.closeButton}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#333")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <X style={styles.closeIcon} />
          </button>
          <h2 style={styles.title}>About Us & Privacy Policy</h2>

          <div style={styles.content}>
            <h3 style={styles.sectionTitle}>About Us</h3>
            <p style={styles.text}>
              At Strategy Fox, we are pioneers in crafting immersive and
              innovative digital experiences that redefine the way businesses
              interact with their customers. Our expertise lies in creating
              cutting-edge XR solutions, web-based 3D experiences, and
              interactive commerce platforms tailored to meet the unique needs of
              our clients.
            </p>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>Privacy Policy</h3>
            <p style={styles.text}>
              <strong>Effective Date:</strong> January 2, 2025
            </p>
            <p style={styles.text}>
              Strategy Fox ("we," "our," "us") values your privacy and is
              committed to protecting your personal information. This Privacy
              Policy outlines how we collect, use, and safeguard your information
              when you interact with our services, websites, and applications.
            </p>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>Information We Collect</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Personal Information:</strong> Name, email address, phone
                number, billing and shipping address, payment details (processed
                securely by third-party payment processors).
              </li>
              <li style={styles.listItem}>
                <strong>Non-Personal Information:</strong> Browser type, device
                type, operating system, IP address, geographic location, usage
                data (e.g., pages visited, time spent on the site).
              </li>
              <li style={styles.listItem}>
                <strong>Cookies:</strong> We use cookies to enhance user
                experience, track website traffic, and personalize content.
              </li>
            </ul>
          </div>

          <button
            style={styles.button}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)
            }
            onClick={handleClose}
          >
            Accept & Close
          </button>
        </div>
      </div>
    </>
  );
};

export default InfoModal;