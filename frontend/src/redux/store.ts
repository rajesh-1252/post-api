import { configureStore } from '@reduxjs/toolkit';
import postReducer from './slice/postSlice';
import notificationReducer from './slice/notificationSlice';

export const store = configureStore({
  reducer: {
    posts: postReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
