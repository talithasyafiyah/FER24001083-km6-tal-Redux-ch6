import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import authReducers from "./reducers/authReducers";
import recipeReducers from "./reducers/recipeReducers";
import { thunk } from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducers from "./reducers/authReducers";

const rootReducer = combineReducers({
  auth: authReducers,
  recipe: recipeReducers,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ['recipe']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(thunk),
});

export const persistor = persistStore(store);
