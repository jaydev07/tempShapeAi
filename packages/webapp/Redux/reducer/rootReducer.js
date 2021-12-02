// libraries
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

// configs
import { persistConfig } from "../../config/reduxPersist.config";

// Reducers
import userReducer from "./user/user.reducer";
import bootcampReducer from "./bootcamp/bootcamp.reducer"
import errorReducer from "./Error/error.reducer";

// root reducer
const rootReducer = combineReducers({
  /* Add Reducers here */
  userReducer,
  bootcampReducer,
  errorReducer,
});

// warpping up the root reducer with redux-persist to store state in session storage
export const persistedState = persistReducer(persistConfig, rootReducer);
