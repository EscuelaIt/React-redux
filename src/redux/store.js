import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./todo-slice";

export const store = configureStore({
  reducer: {
    todos: todoReducer,
  },
});
