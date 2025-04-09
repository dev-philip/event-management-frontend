// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../app/features/counter/counterSlice';
import userReducer from '../app/features/user/userSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
