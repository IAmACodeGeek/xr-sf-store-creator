import Swal from "sweetalert2";
import styles from "./UI.module.css";

const showPremiumPopup: () => void = () => {
  Swal.fire({
    title: "Subscribe to Premium",
    text: "You cannot have more than 20 products. Contact the sales team.",
    icon: "warning",
    showConfirmButton: true,
    allowOutsideClick: false,
    customClass: {
      title: styles.swalTitle,
      popup: styles.swalPopup,
    },
  });
};

export default showPremiumPopup;