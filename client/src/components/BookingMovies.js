import styles from "./css/BookingMovies.module.css"
import CancelModal from "../modals/CancelModal";
import { Fragment, useState } from "react";

const BookingMovies = (props)=>{

    const record = props.details;
    const [showModal,setShowModal]=useState(false);
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const time = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30',
    '31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60']

    const CancelHandler = ()=>{
        setShowModal(true);
    }

    const closeModalHandler = ()=>{
        setShowModal(false);
    }
    const CancelTicketHandler = ()=>{
        console.log("ticket Cancelled")
        props.onCancel(record.ticketId);
        setShowModal(false);
    }


    return <Fragment>
    {showModal && <CancelModal onAccept={CancelTicketHandler} onCancel={closeModalHandler} />}
    <div className={styles.ticket}>
    <div className={styles.bookedTicket}>
    <span className={styles.round}></span>
    <div className={styles.topDetails}>
        <div className={styles.movieImg}><img src={record.movieImage} alt="movie-pic"/></div>
        <div className={styles.details}>
            <div className={styles.language}>{record.language.toUpperCase()},2D</div>
            <div className={styles.movieName}>{record.movieName}</div>
            <div className={styles.theatre}>{record.theatreName} , {record.theatreCity}</div>
            <div className={styles.time}>{days[new Date(record.showTime).getDay()]}, {time[new Date(record.showTime).getDate()]} {monthNames[new Date(record.showTime).getMonth()]} | {time[new Date(record.showTime).getHours()]}:{time[new Date(record.showTime).getMinutes()]} UTC</div>
            {props.showBtn && <div className={styles.showButton}><button onClick={CancelHandler}>Cancel Ticket</button></div>}
        </div>
    </div>
    <div className={styles.bottomDetails}>
        <div className={styles.screen}>
            <div className={styles.label}>SCREEN</div>
            <div className={styles.screenName}>SCREEN {record.screenName}</div>
        </div>
        <div className={styles.seats}>
        <div className={styles.label}>SEATS</div>
        <div className={styles.seatName}>{record.seats}</div>
        </div>
    </div>
    </div>

    </div>
    </Fragment>

}

export default BookingMovies;