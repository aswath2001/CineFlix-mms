import {createSlice} from "@reduxjs/toolkit"

// console.log(JSON.parse(localStorage.getItem('token')).expiry);




const browserToken = (!!localStorage.getItem('token'))?JSON.parse(localStorage.getItem('token')).value:null;

const expired = (!!browserToken)?( JSON.parse(localStorage.getItem('token')).expiry > new Date().getTime()):false;
console.log("exipred: ", expired);

const initialState = {loggedIn:(!!browserToken && expired),token:(!!browserToken && expired)?browserToken:null}; 
console.log(initialState);

const authSlice = createSlice({
    name:'auth',
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
            localStorage.setItem('token',JSON.stringify(item));
        },
        logout(state){
            state.loggedIn = false;
            state.token = null; 
            localStorage.removeItem('token');
        }
    }
});

export const authActions = authSlice.actions;

export const logoutUser = ()=>{
    return async(dispatch)=>{
        const logoutHandler = async()=>{
            const loggedOut = await fetch("/logout");
            console.log(loggedOut);
            if(!loggedOut.loginStatus){
                dispatch(authActions.logout());
            }
        }

        await logoutHandler();
    }
}




// export const checkUserAuthentication = ()=>{
//     return async(dispatch)=>{

//         const sendRequest = async()=>{
//             const response = await fetch("/profile");
//             const data = await response.json();

//             console.log("login status : ",data.loginStatus)

//             if(!data.loginStatus){
//                 throw new Error("user is not loggedIn");
//             }
//             console.log("in action creator");
//         }

//         try{
//             await sendRequest();
//             dispatch(authSlice.actions.login());
            
//         }catch(err){
//             console.log(err.message);
            
//         }
//     }
// }




export default authSlice;