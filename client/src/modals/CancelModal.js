import styles from "./css/CancelModal.module.css"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const CancelModal = (props)=>{

    const history = useHistory();

    const cancelHandler = ()=>{
        props.onCancel();
    }

    const acceptHandler = ()=>{
        props.onAccept();
    }

    return <div className={styles.background}>
        <div className={styles.CancelBlock}>
            <div className={styles.cancelTicket}>
                Are You Sure you want to cancel this ticket ?
            </div>
            
            <div className={styles.button}>
                <button className={styles.cancelButton} onClick={cancelHandler}>Cancel</button>
                <button className={styles.acceptButton} onClick={acceptHandler}>Accept</button>

            </div>
        </div>

    </div>
}

export default CancelModal;