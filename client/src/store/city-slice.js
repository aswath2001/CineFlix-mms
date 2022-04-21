import {createSlice} from "@reduxjs/toolkit"
import { movieActions } from "./movie-slice";
import axios from "axios"

const initialState = {city:!!(localStorage.getItem('city'))?JSON.parse(localStorage.getItem('city')).city:"Coimbatore"}

const citySlice = createSlice({
    name:"city",
    initialState:initialState,
    reducers:{
        updateCity(state,action){
            state.city = action.payload;
            localStorage.setItem('city',JSON.stringify({city:action.payload}))
        }
    }
})

export const cityActions = citySlice.actions;

export const addNewMovies= (city)=>{
    return async(dispatch)=>{
        console.log(city)

        const sendRequest = async()=>{
            
            const response = await fetch("/getMovies/"+city);

            if(!response){
                throw new Error('Request Failed');
            }
            const data = await response.json();
            dispatch(movieActions.addMovies(await data.movies));
            dispatch(cityActions.updateCity(city));
        }

        try{
            await sendRequest();
        }catch(e){
            console.log("error",e.message );
        }

    }
}




export default citySlice;