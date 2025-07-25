import Swal from "sweetalert2";
import styles from "../UI.module.scss";

const showPremiumPopup: (description: string) => void = (description: string) => {
  Swal.fire({
    title: "Subscribe to Premium",
    text: description,
    icon: "warning",
    showCancelButton: true,
    showConfirmButton: true,
    allowOutsideClick: false,
    confirmButtonText: "Contact Sales",
    customClass: {
      title: styles.swalTitle,
      popup: styles.swalPopup,
      htmlContainer: styles.swalHtmlContainer,
      icon: styles.swalIcon,
      actions: styles.swalActions,
      confirmButton: `${styles.swalButton} ${styles.swalConfirmButton}`,
      cancelButton: `${styles.swalButton} ${styles.swalCancelButton}`,
    },
  }).then((result) => {
    if(result.isConfirmed){
      window.open("https://strategyfox.in/#sec-contact", "_blank", "noopener,noreferrer");
    }
  });
};

export {showPremiumPopup};