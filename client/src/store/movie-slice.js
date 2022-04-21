import {createSlice} from "@reduxjs/toolkit"

const initialState ={movies:null};

const movieSlice = createSlice({
    name:'movie',
    initialState:initialState,
    reducers:{
        addMovies(state,action){
            state.movies = action.payload
        }
    }
})


export const movieActions = movieSlice.actions;

export default movieSlice;