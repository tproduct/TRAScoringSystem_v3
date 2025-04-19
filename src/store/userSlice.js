import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isLoggedIn: true,
//   info: null
// };
const initialState = {
  isLoggedIn: true,
  info: {
    id: "user_67a156827ff8a",
    name: "test3234",
    email: "tes@test.com",
    organization: "",
  },
  monitor: {
    id: "mnt_111111",
    user_id: "user_67a156827ff8a",
    switch_time: 10,
    interval_time: 5,
    group_size: 10,
  }
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      
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
