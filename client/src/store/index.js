import {configureStore} from "@reduxjs/toolkit"

import authSlice from "./Auth-slice"
import movieSlice from "./movie-slice";
import showInfoSlice from "./show-info-slice";
import citySlice from "./city-slice";
import adminSlice from "./Admin-slice";

const store = configureStore({
    reducer:{auth:authSlice.reducer,movie:movieSlice.reducer,showInfo:showInfoSlice.reducer,city:citySlice.reducer,admin:adminSlice.reducer}
});

export  default store;