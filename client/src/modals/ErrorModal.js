import styles from "./css/ErrorModal.module.css"
import ReactDOM from "react-dom";

const ErrorModal = (props)=>{

    return ReactDOM.createPortal(<div className={styles.background}>
    <div className={styles.centered}>
    <div className={styles.errorMsg}>
        <div className={styles.msg}>{props.message}</div>
    </div>
    </div>
    </div>,document.getElementById('modal-root')); 


}

export default ErrorModal;