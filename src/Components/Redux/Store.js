// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import eventsReducer from "../Redux/eventReducer";

const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
});

export default store;
