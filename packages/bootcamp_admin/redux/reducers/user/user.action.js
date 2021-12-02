// Reducer Types
import {
  LOGIN,
} from "./user.type";

// GQL Queries
import {
  LOGIN_USER_QUERY,
  GET_CURRENT_USER_QUERY
} from "../../../gql/users";


// Apollo client
import graphQlClient from "../../../configs/ApolloClient.config";

// Helper redux action
import { requestfailed } from "../Error/error.action";

// Utilities
import { requestSuccess, loading } from "../../../utils/global.utils";
const GET_CURRENT_USER = "GET_CURRENT_USER"

// Action to login user
export const loginUserAction = (loginData) => async (dispatch) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.mutate({
      mutation: LOGIN_USER_QUERY,
      variables: loginData,
    });

    localStorage.setItem("userToken", data.login.token);

    if (data) return dispatch(requestSuccess(LOGIN, data.login));
  } catch (error) {
    return dispatch(requestfailed(error.message));
  }
};

// Action to get Current User based on the token store in localstorage
export const getCurrentUserAction = () => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: GET_CURRENT_USER_QUERY,
    });
    return dispatch(requestSuccess(LOGIN, data.getCurrentUser));
  } catch (error) {
    return dispatch(requestfailed(error.message));
  }
};




