import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isLoggedIn: true,
//   info: {
//     id: "user_6813675d31179",
//     name: "test3234",
//     email: "tes@test.com",
//     organization: "",
//   },
//   monitor: {
//     id: "mnt_111111",
//     user_id: "user_6813675d31179",
//     switch_time: 10,
//     interval_time: 5,
//     group_size: 10,
//   }
// };
const initialState = {
  isLoggedIn: false,
  info: null,
  monitor: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.info = action.payload.info;
      state.monitor = action.payload.monitor;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.info = null
    },
    setUser(state, action) {
      state.info = action.payload;
    },
    setMonitor(state, action){
      state.monitor = action.payload;
    }
  },
});

export const { login, logout, setUser, setMonitor } = userSlice.actions;

export default userSlice.reducer;
