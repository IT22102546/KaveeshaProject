import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './user/userSlice';
import studiosReducer from './studio/studiosSlice';
import { studioApi } from './studio/studioApi';


const rootReducer = combineReducers({
  user: userReducer,
  studios: studiosReducer,
  [studioApi.reducerPath]: studioApi.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(studioApi.middleware),
});



export const persistor = persistStore(store);
