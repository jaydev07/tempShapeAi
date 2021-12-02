// libraries
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

// configs
import { persistConfig } from "../../configs/reduxPersist.config";

// Reducers
import courses from "./courses/courses.reducer";
import user from './user/user.reducer'
import error from "./Error/error.reducer";

// root reducer
const rootReducer = combineReducers({ courses, user, error });

// warpping up the root reducer with redux-persist to store state in local storage
export const persistedState = persistReducer(persistConfig, rootReducer);
