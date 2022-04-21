import {createSlice} from "@reduxjs/toolkit"

// console.log(JSON.parse(localStorage.getItem('token')).expiry);




const browserToken = (!!localStorage.getItem('admintoken'))?JSON.parse(localStorage.getItem('admintoken')).value:null;

const expired = (!!browserToken)?( JSON.parse(localStorage.getItem('admintoken')).expiry > new Date().getTime()):false;
console.log("exipred: ", expired);

const initialState = {loggedIn:(!!browserToken && expired),token:(!!browserToken && expired)?browserToken:null}; 
console.log(initialState);

const adminSlice = createSlice({
    name:'admin',
    initialState:initialState,
    reducers:{
        login(state,action){
            state.loggedIn = true;
            state.token = action.payload;
            console.log(action.payload);
    
            const item = {
                value:action.payload,
                expiry:new Date().getTime() + 10*24*60*60*1000
            }
            localStorage.setItem('admintoken',JSON.stringify(item));
        },
        logout(state){
            state.loggedIn = false;
            state.token = null; 
            localStorage.removeItem('admintoken');
        }
    }
});

export const adminActions = adminSlice.actions;

export const logoutUser = ()=>{
    return async(dispatch)=>{
        const logoutHandler = async()=>{
            const loggedOut = await fetch("/adminLogout");
            console.log(loggedOut);
            if(!loggedOut.loginStatus){
                dispatch(adminActions.logout());
            }
        }

        await logoutHandler();
    }
}



export default adminSlice;