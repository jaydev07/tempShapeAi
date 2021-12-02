/*
 * Error redux actions
 */

// Reducer Types
import { GET_ERROR } from "./error.type";

// Action to dispatch error messages to redux store
export const requestfailed = (error) => {
  return {
    type: GET_ERROR,
    payload: error,
  };
};

// Action to clear error
export const clearError = () => (dispatch) => {
  return {
    type: "CLEAR_ERROR",
  };
};
