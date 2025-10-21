import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage for web
import { apiSlice } from "./api";
import userReducer, { localStorageSyncMiddleware } from "./redux/user";
import transactionReducer from "./redux/transaction";

// ✅ Combine all reducers first
const rootReducer = combineReducers({
  user: userReducer,
  transaction: transactionReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// ✅ redux-persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["transaction", "user"], // persist only these slices
};

// ✅ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }).concat(apiSlice.middleware, localStorageSyncMiddleware),
  devTools: true,
});

// ✅ Persistor for PersistGate
export const persistor = persistStore(store);

// ✅ Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
