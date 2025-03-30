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
      confirmButton: styles.swalButton,
      cancelButton: styles.swalButton
    },
  }).then((result) => {
    if(result.isConfirmed){
      window.open("https://strategyfox.in/#sec-contact", "_blank", "noopener,noreferrer");
    }
  });
};

export {showPremiumPopup};