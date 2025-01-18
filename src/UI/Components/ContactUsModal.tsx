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
    margin: "0.5rem 0",
    paddingLeft: "1.5rem",
    color: "#ccc",
    fontSize: "0.9rem",
    lineHeight: 1.6,
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

const ContactUsModal = () => {
  const { isContactModalOpen, closeContactModal } = useComponentStore();


  const handleClose = () => {
    const joystickZone = document.getElementById("joystickZone");
    if (joystickZone) {
      joystickZone.style.display = "block";
    }
    closeContactModal();
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
      <div style={styles.backdrop} onClick={handleClose}>
        <div className="modalContainer" style={styles.modalContainer}>
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
          <h2 style={styles.title}>Contact Us</h2>

          <div style={styles.content}>
            <h3 style={styles.sectionTitle}>Reach Out to Us</h3>
            <p style={styles.text}>
              We value your feedback and inquiries. Please feel free to reach
              out to us through the following contact details:
            </p>
            <div style={styles.divider}></div>
            <p style={styles.text}>
              <strong>Email:</strong> deltaXR@support.com
            </p>
            <p style={styles.text}>
              <strong>Phone:</strong> 022 4444 502
            </p>
            <p style={styles.text}>
              <strong>Address:</strong> Chennai, Tamil Nadu, India
            </p>

            <h3 style={styles.sectionTitle}>Frequently Asked Questions (FAQs)</h3>
            <div style={styles.divider}></div>
            <h4 style={styles.sectionTitle}>1. What is Delta XR?</h4>
            <p style={styles.text}>
              Delta XR is an immersive extended reality (XR) platform developed
              by Strategy Fox. It allows users to explore virtual 3D
              environments, interact with products, and enjoy unique digital
              experiences.
            </p>

            <h4 style={styles.sectionTitle}>2. What devices can I use to access Delta XR?</h4>
            <p style={styles.text}>
              Delta XR is compatible with modern browsers and devices that
              support WebGL, including:
            </p>
            <ul style={styles.list}>
              <li>Desktop/Laptops: Chrome, Firefox, Edge, Safari</li>
              <li>Mobile/Tablet: iOS and Android devices with updated browsers</li>
            </ul>

            <h4 style={styles.sectionTitle}>3. How can I make purchases within Delta XR?</h4>
            <p style={styles.text}>
              All purchases made within Delta XR are processed through secure
              third-party platforms, such as Shopify. Simply click on the
              product within the experience to view details and complete the
              transaction.
            </p>

            <h4 style={styles.sectionTitle}>4. What if I face technical issues while using Delta XR?</h4>
            <p style={styles.text}>
              If you experience any technical problems, please:
            </p>
            <ul style={styles.list}>
              <li>Ensure your browser or app is updated to the latest version.</li>
              <li>Check your internet connection.</li>
              <li>Clear your browser cache and cookies.</li>
              <li>Contact our support team at deltaXR@support.com or call us at 022 4444 502 for further assistance.</li>
            </ul>

            <h4 style={styles.sectionTitle}>5. Are my data and privacy secure?</h4>
            <p style={styles.text}>
              Yes, we take user privacy seriously. Data collected is used solely
              to enhance your experience and ensure personalized services.
              Please refer to our Privacy Policy for more details on how your
              information is handled.
            </p>

            <h4 style={styles.sectionTitle}>6. Can I request a refund for purchases?</h4>
            <p style={styles.text}>
              Refunds, if applicable, will be processed in accordance with our
              Refund Policy. Please contact our support team with your order
              details to initiate the refund process.
            </p>
          </div>

          <button
            style={styles.button}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                styles.button.backgroundColor)
            }
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default ContactUsModal;
