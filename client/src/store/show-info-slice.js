import { createSlice } from "@reduxjs/toolkit";

const initialState = { show:null};

const showInfoSlice = createSlice({
    name:'showInfo',
    initialState:initialState,
    reducers:{
        addShow(state,action){
            state.show = action.payload;
        }
    }
})

export const showInfoActions  = showInfoSlice.actions;

export default showInfoSlice;