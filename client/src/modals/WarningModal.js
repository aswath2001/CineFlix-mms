import { Fragment } from "react";
import styles from "./css/WarningModal.module.css"
import CancelIcon from '@mui/icons-material/Cancel';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const WarningModal = (props)=>{

    const history = useHistory();

    const cancelHandler = ()=>{
        props.cancelWarning();
    }

    const acceptHandler = ()=>{
        history.push(props.url)
    }

    return <div className={styles.background}>
        <div className={styles.WarningBlock}>
            <div className={styles.Terms}>
                Terms & Conditions 
                <CancelIcon className={styles.cancel} onClick={cancelHandler}/>
            </div>
            
            <div className={styles.Conditions}>
            The Government mandates that only those that are vaccinated (Atleast one dose) can be allowed into Cinema halls.
            <div className={styles.conditionOne}>
                1. Entry is allowed only those who have taken first dose of vaccination. (above 18 years of age)
            </div>
            <div className={styles.conditionTwo}>
                2. For your own safety, wearing face masks is compulsory for entering the cinema premises.
            </div>
            <div className={styles.conditionThree}>
                3. Temperature checks will be conducted at the cinema. Patrons with high temperature (above 37.3 C or 99.14 F) will not be allowed inside.
            </div>
            <div className={styles.conditionFour}>
                4. Entry is allowed only for valid ticket holders.
            </div>
            <div className={styles.conditionFive}>
                5. Guests aged under 18 will not be allowed in `A` rated movies
            </div>
            <div className={styles.conditionSix}>
                6. Children above the age of 3 years require tickets for `U` or `U/A` rated movies.
            </div>
            </div>
            <div className={styles.button}>
                <button className={styles.cancelButton} onClick={cancelHandler}>Cancel</button>
                <button className={styles.acceptButton} onClick={acceptHandler}>Accept</button>

            </div>
        </div>

    </div>
}

export default WarningModal;