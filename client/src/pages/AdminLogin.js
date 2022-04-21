import {Link} from "react-router-dom"
import { Fragment, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./css/Login.module.css"
import useInput from "../hooks/use-input";
import { Prompt, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import useRequest from "../hooks/use-request";
import { adminActions } from "../store/Admin-slice";
import { useDispatch,useSelector } from "react-redux";
import LoadingModal from "../modals/LoadingModal";
import ErrorModal from "../modals/ErrorModal";

const AdminLogin = () =>{

    const dispatch = useDispatch();
    const history = useHistory();
    const authStatus = useSelector(state =>state.admin.loggedIn);

    if(authStatus){
        history.replace("/adminHome")
    }

    const {enteredValue:emailInput,
        isTouched:emailIsTouched,
        valueIsValid:emailIsValid ,
        valueInputHandler:emailInputHandler,
        valueTouchHandler:emailTouchHandler,
        resetHandler:resetEmailHandler } = useInput((email)=>{return email.includes('@')});
    
    const {enteredValue:passwordInput,
        isTouched:passwordIsTouched,
        valueIsValid:passwordIsValid,
        valueInputHandler:passwordInputHandler,
        valueTouchHandler:passwordTouchHandler,
        resetHandler:resetPasswordHandler} = useInput((password)=>{return password.length>=6});

    
    const {
        isLoading:isPageLoading,
        error:error,
        setError:setError,
        sendRequest:verifyLogin,
    } = useRequest();

    const [isloggedIn,setLoggedIn] = useState(false);
    const [formSubmitted,setFormSubmitted] = useState(false);
    
    const formIsValid = emailIsValid && passwordIsValid;

    const responseHandler = (data)=>{
        if(data.loginStatus){
            dispatch(adminActions.login(data.token));
            setLoggedIn(true);
        }else{
            setError(data.message);
            setFormSubmitted(false);
        }

    }

    const FormSubmitHandler = async(e)=>{
        e.preventDefault();
        setError('');
        setFormSubmitted(true);
        const objBody = {email:emailInput,password:passwordInput};
        const configObject = {url:"/adminlogin",method:'POST',headers:{'Content-Type':'application/json'},body:objBody};
        console.log(authStatus);
        await verifyLogin(configObject,responseHandler);
        console.log(authStatus);
        resetEmailHandler();
        resetPasswordHandler();
    }


    if(isloggedIn){
        console.log("logged In");
        alert("LogIn Successful !!!!!!");
        history.replace("/home");
    }

    return <Fragment>
        {isPageLoading && <LoadingModal />}
        {error!== '' && <ErrorModal message={error} />}
        <Prompt when={(emailIsTouched || passwordIsTouched)&& !formSubmitted} message = {()=>"Are you sure,You want to leave? All the Data will be Lost"} />
        <div className={styles.loginForm}>
            <div className={styles.loginTitle}>Admin Login</div>
            <form onSubmit= {FormSubmitHandler} className="form-group">
                <div className={`${styles.emailInputClass} ${emailIsTouched && !emailIsValid && styles.invalid}`}>
                    <input value={emailInput} onChange={emailInputHandler} onBlur={emailTouchHandler} type="email" placeholder="Enter Your Email" />
                    {emailIsTouched && !emailIsValid && <span>The Email provided is Invalid</span>}
                </div>
                <div className={`${styles.emailInputClass} ${passwordIsTouched && !passwordIsValid && styles.invalid}`}>
                    <input value={passwordInput} onChange={passwordInputHandler} onBlur={passwordTouchHandler} type="password" placeholder="Enter Your Password" />
                    {passwordIsTouched && !passwordIsValid && <span>The password provided is Invalid</span>}
                </div>
                <div className={styles.submitButtonClass}>
                    <button disabled={!formIsValid} type="submit" className={styles.loginButton}>Login</button>
                </div>

            </form>
        </div>
    </Fragment>;

}

export default AdminLogin;