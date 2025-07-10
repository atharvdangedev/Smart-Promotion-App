import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import menuReducer from "./reducers/menuReducer";
import themeReducer from "./reducers/themeReducer";
import layoutReducer from "./reducers/layoutReducer";
import strokeReducer from "./reducers/strokeReducer";
import borderLayoutReducer from "./reducers/borderLayoutReducer";
import {
  borderRadiusReducer,
  boxLayoutReducer,
  iconColorReducer,
  monochromeReducer,
  screenWidthReducer,
  themeModeReducer,
} from "./reducers/moreSettingsReducer";

const appReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  theme: themeReducer,
  layout: layoutReducer,
  stroke: strokeReducer,
  borderLayout: borderLayoutReducer,
  boxLayout: boxLayoutReducer,
  monochrome: monochromeReducer,
  borderRadius: borderRadiusReducer,
  iconColor: iconColorReducer,
  themeMode: themeModeReducer,
  screenWidth: screenWidthReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "menu",
    "theme",
    "layout",
    "stroke",
    "borderLayout",
    "boxLayout",
    "monochrome",
    "borderRadius",
    "iconColor",
    "themeMode",
    "screenWidth",
  ],
};

const persistedReducer = persistReducer(persistConfig, appReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
