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

const TermsConditionsModal = () => {
  const { isTermsModalOpen, closeTermsModal } = useComponentStore();


  const handleClose = () => {
    const joystickZone = document.getElementById("joystickZone");
    if (joystickZone) {
      joystickZone.style.display = "block";
    }
    closeTermsModal();
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
          <h2 style={styles.title}>Terms and Conditions</h2>

          <div style={styles.content}>
            <h3 style={styles.sectionTitle}>1. Introduction</h3>
            <p style={styles.text}>
              Welcome to <strong>Delta XR</strong> (the "Experience"), created and managed by <strong>Strategy Fox</strong>. These Terms and Conditions ("Terms") govern your access to and use of the Delta XR Experience, including any content, functionality, and services offered within the platform.
            </p>
            <p style={styles.text}>
              By accessing or using Delta XR, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, you may not use the Experience.
            </p>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>2. Eligibility</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                You must be at least <strong>13 years old</strong> to use Delta XR. If you are under the age of majority in your jurisdiction, you must have parental or guardian consent to access the Experience.
              </li>
              <li style={styles.listItem}>
                By using Delta XR, you confirm that you meet the eligibility requirements.
              </li>
            </ul>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>3. Use of the Experience</h3>
            <p style={styles.text}>When using Delta XR, you agree:</p>
            <ul style={styles.list}>
              <li style={styles.listItem}>To use the Experience only for lawful and personal purposes.</li>
              <li style={styles.listItem}>Not to engage in any activity that interferes with or disrupts the Experience or its servers.</li>
              <li style={styles.listItem}>Not to upload, share, or transmit any harmful, offensive, or unauthorized content.</li>
              <li style={styles.listItem}>Not to attempt unauthorized access to Delta XR systems or data.</li>
            </ul>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>4. Intellectual Property</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                All content within Delta XR, including text, graphics, logos, images, 3D models, software, and interactive features, is the property of <strong>Strategy Fox</strong> or its licensors.
              </li>
              <li style={styles.listItem}>
                You are granted a limited, non-exclusive, non-transferable license to use the Experience for personal, non-commercial purposes.
              </li>
              <li style={styles.listItem}>
                Any reproduction, distribution, modification, or public display of Delta XR content without prior written consent is strictly prohibited.
              </li>
            </ul>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>5. Purchases and Payments</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Any purchases made within Delta XR are processed through secure third-party platforms such as Shopify or other integrated services.
              </li>
              <li style={styles.listItem}>
                Refunds, if applicable, will follow the terms outlined in our <strong>Refund Policy</strong>. Please refer to the payment gateway or contact us for more details.
              </li>
            </ul>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>6. Privacy and Data Collection</h3>
            <p style={styles.text}>
              By using Delta XR, you consent to the collection and use of your data as described in our <strong>Privacy Policy</strong>.
            </p>
            <p style={styles.text}>
              Data collected is used to enhance the Experience and ensure personalized and secure services. We prioritize user privacy and comply with applicable data protection regulations.
            </p>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>7. Limitation of Liability</h3>
            <p style={styles.text}>
              Delta XR is provided on an "as is" basis without any warranties, express or implied. <strong>Strategy Fox</strong> is not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use Delta XR, including but not limited to:
            </p>
            <ul style={styles.list}>
              <li style={styles.listItem}>Data loss</li>
              <li style={styles.listItem}>Device damage</li>
              <li style={styles.listItem}>Connectivity issues</li>
              <li style={styles.listItem}>Third-party content inaccuracies</li>
            </ul>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>8. User Content</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                Users may upload or share content within Delta XR, including text, audio, or visual media. By doing so, you:
                <ul style={styles.list}>
                  <li style={styles.listItem}>Grant <strong>Strategy Fox</strong> a non-exclusive, worldwide, royalty-free license to use, display, and adapt the content for operational and promotional purposes.</li>
                  <li style={styles.listItem}>Confirm that the content does not violate the rights of any third party or any applicable laws.</li>
                </ul>
              </li>
            </ul>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>9. Termination</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>We reserve the right to suspend or terminate access to Delta XR, without notice, if:</li>
              <ul style={styles.list}>
                <li style={styles.listItem}>You violate these Terms.</li>
                <li style={styles.listItem}>Your actions harm other users or the platform’s integrity.</li>
              </ul>
            </ul>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>10. Updates to the Terms</h3>
            <p style={styles.text}>
              <strong>Strategy Fox</strong> reserves the right to update or modify these Terms at any time. Changes will take effect immediately upon posting in Delta XR.
            </p>
            <p style={styles.text}>
              Continued use of Delta XR after any updates indicates your acceptance of the revised Terms.
            </p>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>11. Governing Law</h3>
            <p style={styles.text}>
              These Terms are governed by the laws of <strong>India</strong>, and specifically the state of <strong>Tamil Nadu</strong>. Any disputes arising under these Terms or related to Delta XR will be subject to the exclusive jurisdiction of the courts located in <strong>Chennai, Tamil Nadu, India</strong>.
            </p>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>12. Third-Party Services</h3>
            <p style={styles.text}>
              Delta XR may integrate with third-party services, such as Shopify, for payments or external applications for specific functionalities. <strong>Strategy Fox</strong> is not responsible for the practices or content of these third-party services.
            </p>
            <p style={styles.text}>
              Use of third-party services is governed by their respective terms and conditions.
            </p>
            <div style={styles.divider}></div>

            <h3 style={styles.sectionTitle}>13. Contact Information</h3>
            <p style={styles.text}>For questions or concerns about these Terms, please contact <strong>Strategy Fox</strong> at:</p>
            <p style={styles.text}><strong>Email:</strong> deltaXR@support.com</p>
            <p style={styles.text}><strong>Phone:</strong> 022 4444 502</p>
            <p style={styles.text}><strong>Address:</strong> Chennai, Tamil Nadu, India</p>
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
            Accept & Close
          </button>
        </div>
      </div>
    </>
  );
};

export default TermsConditionsModal;
