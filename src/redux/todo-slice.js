import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://todolistapi.escuelait.com/api/todos";

// Thunks asíncronos para realizar las llamadas API
export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addTodo = createAsyncThunk("todos/addTodo", async (todo) => {
  const response = await axios.post(API_URL, todo);
  return response.data;
});

export const updateTodo = createAsyncThunk("todos/updateTodo", async (todo) => {
  const response = await axios.put(`${API_URL}/${todo.id}`, todo);
  return response.data;
});

export const deleteTodo = createAsyncThunk("todos/deleteTodo", async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

export const toggleCompleted = createAsyncThunk(
  "todos/toggleCompleted",
  async (todo) => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
      updated_at: new Date().toISOString(),
    };
    const response = await axios.put(`${API_URL}/${todo.id}`, updatedTodo);
    return response.data;
  }
);

// Slice de Redux
const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        state.todos[index] = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(toggleCompleted.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        state.todos[index] = action.payload;
      });
  },
});

export default todoSlice.reducer;
