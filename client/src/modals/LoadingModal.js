import styles from "./css/LoadingModal.module.css"
import Spinner from 'react-bootstrap/Spinner'
import ticketLoading from "../image/ticketLoading.jpg"
import { Fragment } from "react"
import ReactDOM  from 'react-dom'

const LoadingContent = () =>{
    return(
        <div className={styles.background} >
            <div className={styles.loadingModal}>
                <div className={styles.image}>
                    <img src={ticketLoading} alt="ticket-img" />
                </div>
                <div className={styles.spinner}>
                    <Spinner animation="grow" variant="success" size="sm"/>
                    <Spinner animation="grow" variant="danger" size="sm"/>
                    <Spinner animation="grow" variant="warning" size="sm"/>
                </div>
            </div>
        </div>
        )
}


const LoadingModal = () =>{

    // console.log(document.getElementById('modal-root'))

    return <Fragment>
    {ReactDOM.createPortal(<LoadingContent />,document.getElementById('modal-root'))}
    </Fragment>
}

export default LoadingModal;