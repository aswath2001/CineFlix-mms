import { useEffect, useState } from "react";
import useRequest from "../hooks/use-request";
import LoadingModal from "../modals/LoadingModal";
import styles from "./css/AddMovies.module.css"
import useInput from "../hooks/use-input";





const AddShow = ()=>{

    const {enteredValue:theatreNameInput,
        isTouched:theatreNameIsTouched,
        valueIsValid:theatreNameIsValid ,
        valueInputHandler:theatreNameInputHandler,
        valueTouchHandler:theatreNameTouchHandler,
        resetHandler:resetTheatreNameHandler,
        setEnteredvalue:setTheatreName
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
        resetHandler:resetScreenNameHandler
     } = useInput((number)=>{return number!== ""});  

     const {enteredValue:movieNameInput,
        isTouched:movieNameIsTouched,
        valueIsValid:movieNameIsValid ,
        valueInputHandler:movieNameInputHandler,
        valueTouchHandler:movieNameTouchHandler,
        resetHandler:resetMovieNameHandler
     } = useInput((movie)=>{return movie!== ""});
     
     const {enteredValue:showDateInput,
        isTouched:showDateIsTouched,
        valueIsValid:showDateIsValid ,
        valueInputHandler:showDateInputHandler,
        valueTouchHandler:showDateTouchHandler,
        resetHandler:resetShowDateHandler } = useInput((date)=>{return new Date(date)>new Date()});
    
    const {enteredValue:showTimeInput,
        isTouched:showTimeIsTouched,
        valueIsValid:showTimeIsValid ,
        valueInputHandler:showTimeInputHandler,
        valueTouchHandler:showTimeTouchHandler,
        resetHandler:resetShowTimeHandler } = useInput((time)=>{return true});

    const {
        isLoading:isPageLoading,
        error:error,
        setError:setError,
        sendRequest:showRequest,
    } = useRequest();

    const [formSubmitted,setFormSubmitted] = useState(false);
    const [selectCity,setSelectCity] = useState(false);
    const [selectTheatre,setSelectTheatre] = useState(false);
    const [showDetail,setShowDetail] = useState({theatre:[],movies:[],parsed:false});

    const formIsValid = theatreNameIsValid && theatreCityIsValid && screenNameIsValid ;


    useEffect(()=>{
        const theatreHandler = (data)=>{
            setShowDetail({theatre:data.theatre,movies:data.movies,screen:data.screen,parsed:true});
        }

        showRequest({url:"/getAllShowDetails"},theatreHandler);

    },[])

    const theatreCityHandler = (e)=>{
        setTheatreCity(e.target.value);
        if(e.target.value === ""){
            setSelectCity(false);
        }else{
            setSelectCity(true);
        }
    }

    const theatreNameHandler = (e)=>{
        setTheatreName(e.target.value);
        if(e.target.value === ""){
            setSelectTheatre(false);
        }
        else{
            setSelectTheatre(true);
        }
    }

    const responseHandler = (data)=>{
        alert(data.message);
        setFormSubmitted(false);
        setSelectCity(false);
        setSelectTheatre(false);
    }

    const FormSubmitHandler = async(e)=>{
        e.preventDefault();
        setFormSubmitted(true);
        const timeShow = showDateInput + " "+showTimeInput+":00";
        console.log(timeShow);
        const objBody = {screenId:screenNameInput,movieId:movieNameInput,showTime:timeShow,showDate:showDateInput};
        console.log(objBody)
        const configObject = {url:"/addShow",method:'POST',headers:{'Content-Type':'application/json'},body:objBody};
        await showRequest(configObject,responseHandler);
        resetTheatreNameHandler();
        resetTheatreCityHandler();
        resetScreenNameHandler();
        resetShowDateHandler();
        resetShowTimeHandler();
        resetMovieNameHandler();
    }

    if(!showDetail.parsed){
        return <LoadingModal />
    }

    console.log(showDetail)


    const movieReleaseDate = showDetail.movies.filter(element=>element.movieId === parseInt(movieNameInput)).map(element => element.movieReleaseDate);
    console.log(movieReleaseDate)
    if(movieReleaseDate.length!==0){
        console.log(new Date(movieReleaseDate[0]).toLocaleDateString())
        console.log(new Date(movieReleaseDate[0])>new Date())
    }

    const time = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30',
    '31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60']


    const dt = (movieReleaseDate.length!== 0 )?new Date(movieReleaseDate[0]).toLocaleDateString().split('/'):[]
    console.log(dt);
    const releaseDate = (movieReleaseDate.length !== 0)?dt[2]+'-'+time[dt[0]]+'-'+time[dt[1]]:""
    const c_dt = new Date().toLocaleDateString().split('/');
    const currDate = c_dt[2]+'-'+time[c_dt[0]]+'-'+time[c_dt[1]]

    console.log(currDate,releaseDate)

    return <div className={styles.background}>
    {isPageLoading && <LoadingModal />}
    <div className={styles.Form}>
        <div className={styles.Title}>ADD SHOW DETAILS</div>
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
                <select value={theatreNameInput} onChange={theatreNameHandler} onBlur={theatreNameTouchHandler} defaultValue={""}  disabled={(!selectTheatre)?!selectCity:selectTheatre} required>
                    <option value="">Select Theatre Name</option>
                    {showDetail.theatre.filter(element => element.theatreCity === theatreCityInput ).map((element)=>{
                        return <option value={element.theatreId}>{element.theatreName}</option>
                    })}
                </select>
                {theatreNameIsTouched && !theatreNameIsValid && <span>The Theatre Name provided is Invalid</span>}
            </div>
            <div className={`${styles.InputClass} ${screenNameIsTouched && !screenNameIsValid && styles.invalid}`}>
            <select value={screenNameInput} onChange={screenNameInputHandler} onBlur={screenNameTouchHandler} defaultValue={""}  disabled={ !selectTheatre} required>
                    <option value="">Select Screen Name</option>
                    {showDetail.screen.filter(element => element.theatreId === parseInt(theatreNameInput)).map((element)=>{
                        return <option value={element.screenId}>SCREEN-{element.screenName}</option>
                    })}
                </select>
                {screenNameIsTouched && !screenNameIsValid && <span>The Screen Name provided is Invalid</span>}
            </div>
            <div className={`${styles.InputClass} ${movieNameIsTouched && !movieNameIsValid && styles.invalid}`}>
            <select value={movieNameInput} onChange={movieNameInputHandler} onBlur={movieNameTouchHandler} defaultValue={""}  disabled={ !selectTheatre} required>
                    <option value="">Select Movie Name</option>
                    {showDetail.movies.map((element)=>{
                        return <option value={element.movieId}>{element.movieName}</option>
                    })}
                </select>
                {movieNameIsTouched && !movieNameIsValid && <span>The Movie Name provided is Invalid</span>}
            </div>


            <div className={`${styles.InputClass} ${showDateIsTouched && !showDateIsValid && styles.invalid}`}>
                    <input value={showDateInput} onChange={showDateInputHandler} onBlur={showDateTouchHandler} type="date"  min={`${(movieReleaseDate.length === 0?currDate:((new Date(movieReleaseDate[0])>new Date())?releaseDate:currDate)) }`} max={`${(movieReleaseDate.length === 0)?new Date(new Date().setDate(new Date().getDate()+8)).toISOString().substring(0,10):( (new Date(movieReleaseDate[0])<new Date())?new Date(new Date().setDate(new Date().getDate()+8)).toISOString().substring(0,10):new Date(new Date().setDate(new Date(movieReleaseDate[0]).getDate()+8)).toISOString().substring(0,10))}`} placeholder="Select the Movie Release Date" />
                    {showDateIsTouched && !showDateIsValid && <span>The Movie ReleaseDate provided is Invalid</span>}
            </div>

            <div className={`${styles.InputClass} ${showTimeIsTouched && !showTimeIsValid && styles.invalid}`}>
                    <input value={showTimeInput} onChange={showTimeInputHandler} onBlur={showTimeTouchHandler} type="time" placeholder="Select the Show Time" />
                    {showDateIsTouched && !showDateIsValid && <span>The Show Time provided is Invalid</span>}
            </div>

            <div className={styles.submitButtonClass}>
                <button disabled={!formIsValid} type="submit" className={styles.submitButton}>Add Show</button>
            </div>

        </form>
    </div>
</div>
}

export default AddShow;