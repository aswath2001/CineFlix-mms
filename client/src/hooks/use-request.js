import {useState,useCallback} from "react"
import axios from "axios"

const useRequest = () =>{
    const [isLoading,setLoading] = useState(false);
    const [error,setError] = useState('');

    const sendRequest = useCallback(async(configObject,responseHandler)=>{
        setLoading(true);
        try{
            const responseData = await fetch(configObject.url,{
                method:configObject.method?configObject.method:'GET',
                body:configObject.body?JSON.stringify(configObject.body):null,
                headers:configObject.headers?configObject.headers:{},
                
            });


            if(!responseData.ok){
                throw new Error('Request Failed');
            }

            const data = await responseData.json();
            console.log(data)
            responseHandler(await data)
            
        }catch(err){
            setError("Something went wrong !!!");   
        }
        setLoading(false);
    },[]);

    return {
        isLoading,
        error,
        setError,
        sendRequest
    }

}

export default useRequest;