import styles from "./css/AddMovies.module.css"
import { useState } from "react";
import useInput from "../hooks/use-input";
import useRequest from "../hooks/use-request";
import { Prompt } from "react-router-dom/cjs/react-router-dom.min";
import LoadingModal from "../modals/LoadingModal";

const AddTheatre = () =>{

    
    const {enteredValue:theatreNameInput,
        isTouched:theatreNameIsTouched,
        valueIsValid:theatreNameIsValid ,
        valueInputHandler:theatreNameInputHandler,
        valueTouchHandler:theatreNameTouchHandler,
        resetHandler:resetTheatreNameHandler } = useInput((name)=>{return name.trim().length !==0});
    
    const {enteredValue:theatreCityInput,
        isTouched:theatreCityIsTouched,
        valueIsValid:theatreCityIsValid,
        valueInputHandler:theatreCityInputHandler,
        valueTouchHandler:theatreCityTouchHandler,
        resetHandler:resetTheatreCityHandler} = useInput((city)=>{return city !== ""});
    
    const {
        isLoading:isPageLoading,
        error:error,
        setError:setError,
        sendRequest:postMovies,
    } = useRequest();
    

    const {enteredValue:contactNumberInput,
        isTouched:contactNumberIsTouched,
        valueIsValid:contactNumberIsValid ,
        valueInputHandler:contactNumberInputHandler,
        valueTouchHandler:contactNumberTouchHandler,
        resetHandler:resetContactNumberHandler } = useInput((number)=>{return number.length === 10 && !isNaN(number)});
        

    const [formSubmitted,setFormSubmitted] = useState(false);
    
    const formIsValid = theatreNameIsValid && theatreCityIsValid && contactNumberIsValid ;

    const responseHandler = (data)=>{
        alert(data.message);
        setFormSubmitted(false);
    }

    const FormSubmitHandler = async(e)=>{
        e.preventDefault();
    
        setFormSubmitted(true);
        const objBody = {theatreName:theatreNameInput,theatreCity:theatreCityInput,contactNumber:contactNumberInput};
        console.log(objBody)
        const configObject = {url:"/addTheatre",method:'POST',headers:{'Content-Type':'application/json'},body:objBody};
        await postMovies(configObject,responseHandler);
        resetTheatreNameHandler();
        resetTheatreCityHandler();
        resetContactNumberHandler();
    }


    return <div className={styles.background}>
        {isPageLoading && <LoadingModal />}
        <Prompt when={(theatreNameIsTouched || theatreCityIsTouched || contactNumberIsTouched)&& !formSubmitted} message = {()=>"Are you sure,You want to leave? All the Data will be Lost"} />
        <div className={styles.Form}>
            <div className={styles.Title}>ADD THEATRE DETAILS</div>
            <form onSubmit= {FormSubmitHandler} className="form-group">
                <div className={`${styles.InputClass} ${theatreNameIsTouched && !theatreNameIsValid && styles.invalid}`}>
                    <input value={theatreNameInput} onChange={theatreNameInputHandler} onBlur={theatreNameTouchHandler} type="text" placeholder="Enter the Theatre Name" />
                    {theatreNameIsTouched && !theatreNameIsValid && <span>The Theatre Name provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${theatreCityIsTouched && !theatreCityIsValid && styles.invalid}`}>
                    <select value={theatreCityInput} onChange={theatreCityInputHandler} onBlur={theatreCityTouchHandler} defaultValue={""} required>
                        <option value="">Select Theatre City</option>
                        <option value="Mumbai">Mumbai</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Coimbatore">Coimbatore</option>
                    </select>
                    {theatreCityIsTouched && !theatreCityIsValid && <span>The Theatre City provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${contactNumberIsTouched && !contactNumberIsValid && styles.invalid}`}>
                    <input value={contactNumberInput} onChange={contactNumberInputHandler} onBlur={contactNumberTouchHandler} type="text" placeholder="Enter the Contact Number " />
                    {contactNumberIsTouched && !contactNumberIsValid && <span>The Contact Number provided is Invalid</span>}
                </div>
                <div className={styles.submitButtonClass}>
                    <button disabled={!formIsValid} type="submit" className={styles.submitButton}>Add Theatre</button>
                </div>

            </form>
        </div>
    </div>


}

export default AddTheatre;