import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import competitionReducer from "./competitionSlice";

export const store = configureStore({
  reducer:{
    user: userReducer,
    competition: competitionReducer,
  }
})

export default store;