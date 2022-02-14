import { useEffect, useState } from "react";
import useRequest from "../hooks/use-request";
import LoadingModal from "../modals/LoadingModal";
import styles from "./css/AddMovies.module.css"
import useInput from "../hooks/use-input";

const AddScreen = () =>{

    const {enteredValue:theatreNameInput,
        isTouched:theatreNameIsTouched,
        valueIsValid:theatreNameIsValid ,
        valueInputHandler:theatreNameInputHandler,
        valueTouchHandler:theatreNameTouchHandler,
        resetHandler:resetTheatreNameHandler,
     } = useInput((name)=>{return name !== ""});
    
    const {enteredValue:theatreCityInput,
        isTouched:theatreCityIsTouched,
        valueIsValid:theatreCityIsValid,
        valueInputHandler:theatreCityInputHandler,
        valueTouchHandler:theatreCityTouchHandler,
        resetHandler:resetTheatreCityHandler,
    setEnteredvalue : setTheatreCity} = useInput((city)=>{return city !== ""});
    
    const {enteredValue:screenNameInput,
        isTouched:screenNameIsTouched,
        valueIsValid:screenNameIsValid ,
        valueInputHandler:screenNameInputHandler,
        valueTouchHandler:screenNameTouchHandler,
        resetHandler:resetScreenNameHandler } = useInput((number)=>{return !isNaN(number)});  

    const {
        isLoading:isPageLoading,
        error:error,
        setError:setError,
        sendRequest:theatreRequest,
    } = useRequest();

    const [selectCity,setSelectCity] = useState(false);

    const [theatreDetail,setTheatreDetail] = useState({theatre:[],parsed:false});

    const [formSubmitted,setFormSubmitted] = useState(false);


    const formIsValid = theatreNameIsValid && theatreCityIsValid && screenNameIsValid ;

    const responseHandler = (data)=>{
        alert(data.message);
        setFormSubmitted(false);
        setSelectCity(false)
    }

    const FormSubmitHandler = async(e)=>{
        e.preventDefault();
        setFormSubmitted(true);
        const objBody = {theatreId:theatreNameInput,screenName:screenNameInput};
        console.log(objBody)
        const configObject = {url:"/addScreen",method:'POST',headers:{'Content-Type':'application/json'},body:objBody};
        await theatreRequest(configObject,responseHandler);
        resetTheatreNameHandler();
        resetTheatreCityHandler();
        resetScreenNameHandler();
    }

    useEffect(()=>{
        const theatreHandler = (data)=>{
            setTheatreDetail({theatre:data.theatre,parsed:true});
        }

        theatreRequest({url:"/getAllTheatreDetails"},theatreHandler);

    },[])

    const theatreCityHandler = (e)=>{
        setTheatreCity(e.target.value);
        if(e.target.value === ""){
            setSelectCity(false);
        }else{
            setSelectCity(true);
        }

    }

    if(!theatreDetail.parsed){
        return <LoadingModal />
    }

    console.log(theatreDetail)

    return <div className={styles.background}>
    {isPageLoading && <LoadingModal />}
    <div className={styles.Form}>
        <div className={styles.Title}>ADD SCREEN DETAILS</div>
        <form onSubmit= {FormSubmitHandler} className="form-group">
            <div className={`${styles.InputClass} ${theatreCityIsTouched && !theatreCityIsValid && styles.invalid}`}>
                <select value={theatreCityInput} onChange={theatreCityHandler} onBlur={theatreCityTouchHandler} defaultValue={""} disabled={selectCity} required>
                    <option value="">Select Theatre City</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Coimbatore">Coimbatore</option>
                </select>
                {theatreCityIsTouched && !theatreCityIsValid && <span>The Theatre City provided is Invalid</span>}
            </div>
            <div className={`${styles.InputClass} ${theatreNameIsTouched && !theatreNameIsValid && styles.invalid}`}>
                <select value={theatreNameInput} onChange={theatreNameInputHandler} onBlur={theatreNameTouchHandler} defaultValue={""}  disabled={!selectCity} required>
                    <option value="">Select Theatre Name</option>
                    {theatreDetail.theatre.filter(element => element.theatreCity === theatreCityInput ).map((element)=>{
                        return <option value={element.theatreId}>{element.theatreName}</option>
                    })}
                </select>
                {theatreNameIsTouched && !theatreNameIsValid && <span>The Theatre Name provided is Invalid</span>}
            </div>
            <div className={`${styles.InputClass} ${screenNameIsTouched && !screenNameIsValid && styles.invalid}`}>
                    <input value={screenNameInput} onChange={screenNameInputHandler} onBlur={screenNameTouchHandler} type="text" placeholder="Enter the Screen Name" disabled={!selectCity} />
                    {screenNameIsTouched && !screenNameIsValid && <span>The Screen Name provided is Invalid</span>}
            </div>

            <div className={styles.submitButtonClass}>
                <button disabled={!formIsValid} type="submit" className={styles.submitButton}>Add Screen</button>
            </div>

        </form>
    </div>
</div>

}

export default AddScreen;