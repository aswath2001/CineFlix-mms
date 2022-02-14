import styles from "./css/AddMovies.module.css"
import { useState } from "react";
import useInput from "../hooks/use-input";
import useRequest from "../hooks/use-request";
import { Prompt } from "react-router-dom/cjs/react-router-dom.min";
import LoadingModal from "../modals/LoadingModal";

const AddMovies = () =>{

    const {enteredValue:movieNameInput,
        isTouched:movieNameIsTouched,
        valueIsValid:movieNameIsValid ,
        valueInputHandler:movieNameInputHandler,
        valueTouchHandler:movieNameTouchHandler,
        resetHandler:resetMovieNameHandler } = useInput((name)=>{return name.trim().length !==0});
    
    const {enteredValue:movieCastInput,
        isTouched:movieCastIsTouched,
        valueIsValid:movieCastIsValid,
        valueInputHandler:movieCastInputHandler,
        valueTouchHandler:movieCastTouchHandler,
        resetHandler:resetMovieCastHandler} = useInput((movieCast)=>{return movieCast.split(' ').length >= 2});
    
    const {
        isLoading:isPageLoading,
        error:error,
        setError:setError,
        sendRequest:postMovies,
    } = useRequest();
    

    const {enteredValue:movieDirectorInput,
        isTouched:movieDirectorIsTouched,
        valueIsValid:movieDirectorIsValid ,
        valueInputHandler:movieDirectorInputHandler,
        valueTouchHandler:movieDirectorTouchHandler,
        resetHandler:resetMovieDirectorHandler } = useInput((director)=>{return director.trim().length >0});
        
    const {enteredValue:movieDescriptionInput,
        isTouched:movieDescriptionIsTouched,
        valueIsValid:movieDescriptionIsValid,
        valueInputHandler:movieDescriptionInputHandler,
        valueTouchHandler:movieDescriptionTouchHandler,
        resetHandler:resetMovieDescriptionHandler} = useInput((description)=>{return description.trim().length>0});
    
    const {enteredValue:languageInput,
        isTouched:languageIsTouched,
        valueIsValid:languageIsValid ,
        valueInputHandler:languageInputHandler,
        valueTouchHandler:languageTouchHandler,
        resetHandler:resetLanguageHandler } = useInput((langauge)=>{return langauge !== ""});
        
    const {enteredValue:movieRunTimeInput,
        isTouched:movieRunTimeIsTouched,
        valueIsValid:movieRunTimeIsValid,
        valueInputHandler:movieRunTimeInputHandler,
        valueTouchHandler:movieRunTimeTouchHandler,
        resetHandler:resetMovieRunTimeHandler} = useInput((runtime)=>{return runtime.includes('h')});

    const {enteredValue:movieReleaseDateInput,
        isTouched:movieReleaseDateIsTouched,
        valueIsValid:movieReleaseDateIsValid ,
        valueInputHandler:movieReleaseDateInputHandler,
        valueTouchHandler:movieReleaseDateTouchHandler,
        resetHandler:resetMovieReleaseDateHandler } = useInput((releaseDate)=>{return new Date(releaseDate)>new Date()});
        
    const {enteredValue:movieImageInput,
        isTouched:movieImageIsTouched,
        valueIsValid:movieImageIsValid,
        valueInputHandler:movieImageInputHandler,
        valueTouchHandler:movieImageTouchHandler,
        resetHandler:resetMovieImageHandler} = useInput((image)=>{return image.length> 0 });

    const {enteredValue:movieGenreInput,
        isTouched:movieGenreIsTouched,
        valueIsValid:movieGenreIsValid ,
        valueInputHandler:movieGenreInputHandler,
        valueTouchHandler:movieGenreTouchHandler,
        resetHandler:resetMovieGenreHandler } = useInput((genre)=>{return genre.trim().length >0});
        
    const {enteredValue:movieCertificationInput,
        isTouched:movieCertificationIsTouched,
        valueIsValid:movieCertificationIsValid,
        valueInputHandler:movieCertificationInputHandler,
        valueTouchHandler:movieCertificationTouchHandler,
        resetHandler:resetMovieCertificationHandler} = useInput((certification)=>{return certification !== ""});

    const {enteredValue:movieTrailerInput,
        isTouched:movieTrailerIsTouched,
        valueIsValid:movieTrailerIsValid ,
        valueInputHandler:movieTrailerInputHandler,
        valueTouchHandler:movieTrailerTouchHandler,
        resetHandler:resetMovieTrailerHandler } = useInput((trailer)=>{return trailer.trim().length >0});

    const [formSubmitted,setFormSubmitted] = useState(false);
    
    const formIsValid = movieNameIsValid && movieCastIsValid && movieDirectorIsValid && movieDescriptionIsValid && languageIsValid && movieRunTimeIsValid && movieReleaseDateIsValid && movieImageIsValid && movieGenreIsValid && movieCertificationIsValid && movieTrailerIsValid;

    const responseHandler = (data)=>{
        alert(data.message);
        setFormSubmitted(false);
    }

    const FormSubmitHandler = async(e)=>{
        e.preventDefault();
    
        setFormSubmitted(true);
        const objBody = {movieName:movieNameInput,movieCast:movieCastInput,movieDirector:movieDirectorInput,movieDescription:movieDescriptionInput,language:languageInput,movieRunTime:movieRunTimeInput,movieReleaseDate:movieReleaseDateInput,movieImage:movieImageInput,movieGenre:movieGenreInput,movieCertification:movieCertificationInput,movieTrailer:movieTrailerInput};
        console.log(objBody)
        const configObject = {url:"/addMovies",method:'POST',headers:{'Content-Type':'application/json'},body:objBody};
        await postMovies(configObject,responseHandler);
        resetLanguageHandler();
        resetMovieCastHandler();
        resetMovieCertificationHandler();
        resetMovieDescriptionHandler();
        resetMovieDirectorHandler();
        resetMovieGenreHandler();
        resetMovieImageHandler();
        resetMovieNameHandler();
        resetMovieReleaseDateHandler();
        resetMovieRunTimeHandler();
        resetMovieTrailerHandler();
    }


    return <div className={styles.background}>
        {isPageLoading && <LoadingModal />}
        <Prompt when={(movieNameIsTouched || movieCastIsTouched || movieDirectorIsTouched || movieDescriptionIsTouched || languageIsTouched || movieRunTimeIsTouched || movieReleaseDateIsTouched || movieImageIsTouched || movieGenreIsTouched || movieCertificationIsTouched || movieTrailerIsTouched )&& !formSubmitted} message = {()=>"Are you sure,You want to leave? All the Data will be Lost"} />
        <div className={styles.Form}>
            <div className={styles.Title}>ADD MOVIE DETAILS</div>
            <form onSubmit= {FormSubmitHandler} className="form-group">
                <div className={`${styles.InputClass} ${movieNameIsTouched && !movieNameIsValid && styles.invalid}`}>
                    <input value={movieNameInput} onChange={movieNameInputHandler} onBlur={movieNameTouchHandler} type="text" placeholder="Enter the Movie Name" />
                    {movieNameIsTouched && !movieNameIsValid && <span>The Movie Name provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${movieCastIsTouched && !movieCastIsValid && styles.invalid}`}>
                    <input value={movieCastInput} onChange={movieCastInputHandler} onBlur={movieCastTouchHandler} type="text" placeholder="Enter the Movie Cast" />
                    {movieCastIsTouched && !movieCastIsValid && <span>The Movie Cast provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${movieDirectorIsTouched && !movieDirectorIsValid && styles.invalid}`}>
                    <input value={movieDirectorInput} onChange={movieDirectorInputHandler} onBlur={movieDirectorTouchHandler} type="text" placeholder="Enter the Director Name" />
                    {movieDirectorIsTouched && !movieDirectorIsValid && <span>The Movie Director Name provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${movieDescriptionIsTouched && !movieDescriptionIsValid && styles.invalid}`}>
                    <input value={movieDescriptionInput} onChange={movieDescriptionInputHandler} onBlur={movieDescriptionTouchHandler} type="text" placeholder="Enter the Movie Description" />
                    {movieDescriptionIsTouched && !movieDescriptionIsValid && <span>The Movie Description provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${languageIsTouched && !languageIsValid && styles.invalid}`}>
                    <select value={languageInput} onChange={languageInputHandler} onBlur={languageTouchHandler} defaultValue={""} required>
                        <option value="">Select Movie Language</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Tamil">Tamil</option>
                        <option value="Telugu">Telugu</option>
                        <option value="English">English</option>
                        <option value="Malayalam">Malayalam</option>
                    </select>
                    {languageIsTouched && !languageIsValid && <span>The Movie Langauge provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${movieRunTimeIsTouched && !movieRunTimeIsValid && styles.invalid}`}>
                    <input value={movieRunTimeInput} onChange={movieRunTimeInputHandler} onBlur={movieRunTimeTouchHandler} type="text" placeholder="Enter the Movie Run Time" />
                    {movieRunTimeIsTouched && !movieRunTimeIsValid && <span>The Movie RunTime provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${movieReleaseDateIsTouched && !movieReleaseDateIsValid && styles.invalid}`}>
                    <input value={movieReleaseDateInput} onChange={movieReleaseDateInputHandler} onBlur={movieReleaseDateTouchHandler} type="date"  min={`${new Date().toISOString().substring(0,10)}`} max={`${new Date(new Date().setDate(new Date().getDate()+7)).toISOString().substring(0,10)}`} placeholder="Select the Movie Release Date" />
                    {movieReleaseDateIsTouched && !movieReleaseDateIsValid && <span>The Movie ReleaseDate provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${movieImageIsTouched && !movieImageIsValid && styles.invalid}`}>
                    <input value={movieImageInput} onChange={movieImageInputHandler} onBlur={movieImageTouchHandler} type="text" placeholder="Enter the Movie Image URL " />
                    {movieImageIsTouched && !movieImageIsValid && <span>The Movie Image URL provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${movieGenreIsTouched && !movieGenreIsValid && styles.invalid}`}>
                    <input value={movieGenreInput} onChange={movieGenreInputHandler} onBlur={movieGenreTouchHandler} type="text" placeholder="Enter the Movie Genre" />
                    {movieGenreIsTouched && !movieGenreIsValid && <span>The Movie Genre provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${movieCertificationIsTouched && !movieCertificationIsValid && styles.invalid}`}>
                <select value={movieCertificationInput} onChange={movieCertificationInputHandler} onBlur={movieCertificationTouchHandler} defaultValue={""} required>
                        <option value="">Select Movie Certificate</option>
                        <option value="U">U</option>
                        <option value="U/A">U/A</option>
                        <option value="A">A</option>
                    </select>
                    {movieCertificationIsTouched && !movieCertificationIsValid && <span>The Movie Certification provided is Invalid</span>}
                </div>
                <div className={`${styles.InputClass} ${movieTrailerIsTouched && !movieTrailerIsValid && styles.invalid}`}>
                    <input value={movieTrailerInput} onChange={movieTrailerInputHandler} onBlur={movieTrailerTouchHandler} type="text" placeholder="Enter the Movie Trailer URL" />
                    {movieTrailerIsTouched && !movieTrailerIsValid && <span>The Movie Trailer URL provided is Invalid</span>}
                </div>
                <div className={styles.submitButtonClass}>
                    <button disabled={!formIsValid} type="submit" className={styles.submitButton}>Add Movie</button>
                </div>

            </form>
        </div>
    </div>

}

export default AddMovies;