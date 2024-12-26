
import { configureStore } from '@reduxjs/toolkit';
import {cartReducer} from "../src/redux/reducers/itemSlice";
import {authReducer} from "../src/redux/reducers/authSlice";

const store = configureStore({
  reducer: {
    cartReducer,
    authReducer
  }
  // other configurations if needed
});

export default store;
