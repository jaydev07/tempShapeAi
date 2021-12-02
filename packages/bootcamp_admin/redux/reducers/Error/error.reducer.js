import { GET_ERROR } from "./error.type";

const INITIAL_STATE = { error: "" };

const errorReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_ERROR:
      return { ...state, error: action.payload.message };
    case "CLEAR_ERROR":
      return { ...state, error: "" };
    default:
      return state;
  }
};

export default errorReducer;
