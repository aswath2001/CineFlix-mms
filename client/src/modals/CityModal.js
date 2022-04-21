import { cityActions } from "../store/city-slice";
import {useDispatch,useSelector} from "react-redux"
import styles from "./css/CityModal.module.css"
import chennai from "../image/chennai.png"
import mumbai from "../image/mumbai.png"
import coimbatore from "../image/coimbatore.png"
import CancelIcon from '@mui/icons-material/Cancel';
import { Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Fragment, useState } from "react";
import { addNewMovies } from "../store/city-slice";

const CityModal = (props)=>{

    const dispatch = useDispatch();
    const history = useHistory();

    const selectCity = async(city)=>{
        console.log(city)
        await dispatch(addNewMovies(city))
        props.close();
        history.push("/home")
    }

    const cancelHandler = ()=>{
        console.log("cancel")
        props.close();
    }

    return <Fragment>
    <div className={styles.background}>
        <div className={styles.city}>
            <div className={styles.label}>Popular Cities <CancelIcon className={styles.cancel} onClick={cancelHandler}/></div>
            <div className={styles.cities}>
                <div className={styles.cityOne} onClick={()=>{selectCity("Coimbatore")}}>
                    <div className={styles.coimbatoreImg}>
                        <img src={coimbatore} alt="coimbatore-img" />
                    </div>
                    <div className={styles.coimbatoreName}>Coimbatore</div>
                </div>
                <div className={styles.cityTwo} onClick={()=>{selectCity("Chennai")}}>
                    <div className={styles.chennaiImg}>
                        <img src={chennai} alt="chennai-img" />
                    </div>
                    <div className={styles.chennaiName}>Chennai</div>
                </div>
                <div className={styles.cityThree} onClick={()=>{selectCity("Mumbai")}}>
                    <div className={styles.mumbaiImg}>
                        <img src={mumbai} alt="mumbai-img" />
                    </div>
                    <div className={styles.mumbaiName} >Mumbai</div>
                </div>
            </div>
        </div>
    </div>
    </Fragment>

}

export default CityModal;