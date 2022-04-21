import {useState} from "react"

const useInput = (validateFunction)=>{

    const [enteredValue,setEnteredvalue] = useState('');
    const [isTouched,setTouched] = useState(false);

    const valueIsValid = validateFunction(enteredValue);

    const valueInputHandler = (e)=>{
        setEnteredvalue(e.target.value);
    }

    const valueTouchHandler = ()=>{
        setTouched(true);
    }
    const resetHandler = ()=>{
        setEnteredvalue('');
        setTouched(false);
    }

    return {
        enteredValue,
        isTouched,
        valueIsValid,
        setEnteredvalue,
        valueInputHandler,
        valueTouchHandler,
        resetHandler
    }
}

export default useInput;