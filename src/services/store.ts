import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage for web
import { apiSlice } from "./api";
import userReducer from "./redux/user";
import transactionReducer from "./redux/transaction";
import walletReducer from "./redux/wallet";

// ✅ Combine all reducers first
const rootReducer = combineReducers({
  user: userReducer,
  transaction: transactionReducer,
  wallet: walletReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// ✅ redux-persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["transaction", "user", "wallet"], // persist only these slices
};

// ✅ Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ✅ Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }).concat(apiSlice.middleware),
  devTools: true,
});

// ✅ Persistor for PersistGate
export const persistor = persistStore(store);

// ✅ Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
