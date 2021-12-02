// Reducer Types
import {
  LOGIN,
  REGISTER,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_IMAGE,
  UPDATE_XP,
  GET_ALL_CERTIFICATE,
  GET_CERTIFICATE,
  GET_CURRENT_USER,
  SET_USER_STATUS,
  GET_USER_STATE
} from "./user.type";

// GQL Queries
import {
  LOGIN_USER_QUERY,
  REGISTER_USER_QUERY,
  VERIFY_USER_EMAIL,
} from "../../../gql/auth/";
import {
  UPDATE_USER_PROFILE_QUERY,
  GET_ALL_CERTIFICATE_QUERY,
  GET_CERTIFICATE_QUERY,
  GET_CURRENT_USER_QUERY,
  GET_CURRENT_USER_STATUS,
  SET_USER_STATUS_QUERY,
} from "../../../gql/user";

// Apollo client
import graphQlClient from "../../../config/ApolloClient.config";

// Helper redux action
import { requestfailed } from "../Error/error.action";

// Utilities
import { requestSuccess, loading } from "../../../utils/global.utils";

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

// Action to Register user
export const registerUserAction = (registerData) => async (dispatch) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.mutate({
      mutation: REGISTER_USER_QUERY,
      variables: registerData,
    });
    localStorage.setItem("userToken", data.register.token);

    if (data) return dispatch(requestSuccess(REGISTER, data.register));
  } catch (error) {
    return dispatch(requestfailed(error.message));
  }
};

// Action to update user profile
export const updateUserProfileAction = (userUpdateInput) => async (
  dispatch
) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.mutate({
      mutation: UPDATE_USER_PROFILE_QUERY,
      variables: userUpdateInput,
    });

    if (data)
      return dispatch(
        requestSuccess(UPDATE_USER_PROFILE, data.updateUserProfile)
      );
  } catch (error) {
    console.log({ error });
    return dispatch(requestfailed(error.message));
  }
};

// Action to update user profile image
export const updateUserProfileImageAction = (profilePicture) => async (
  dispatch
) => {
  try {
    return dispatch(requestSuccess(UPDATE_USER_PROFILE_IMAGE, profilePicture));
  } catch (error) {
    return dispatch(requestfailed(error.message));
  }
};

// Action to update user xp
export const updateUserXp = (xp) => (dispatch) => {
  return dispatch(requestSuccess(UPDATE_XP, xp > 0 ? xp : 5));
};

export const verifyUserEmail = (token) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.mutate({
      mutation: VERIFY_USER_EMAIL,
      variables: { token },
    });
    if (data)
      return dispatch(
        requestSuccess(UPDATE_USER_PROFILE, {
          isVerified: data.verifyUserEmail,
        })
      );
  } catch (error) {
    return dispatch(requestfailed(error.message));
  }
};

// Action to get all certificate of the user
export const getAllCertificatesAction = () => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: GET_ALL_CERTIFICATE_QUERY,
    });
    return dispatch(requestSuccess(GET_ALL_CERTIFICATE, data.getCertificates));
  } catch (error) {
    return dispatch(requestfailed(error.message));
  }
};

// Action to get selected certificate
export const getCertificateAction = (credentialId) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: GET_CERTIFICATE_QUERY,
      variables: { credentialId },
    });
    return dispatch(requestSuccess(GET_CERTIFICATE, data.getCertificate));
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
    return dispatch(requestSuccess(GET_CURRENT_USER, data.getCurrentUser));
  } catch (error) {
    return dispatch(requestfailed(error.message));
  }
};

export const getCurrentUserStatus = () => async dispatch => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: GET_CURRENT_USER_STATUS,
    });
    return dispatch(requestSuccess(SET_USER_STATUS, data.getUserStatus));
  } catch (error) {
    return dispatch(requestfailed(error.message));
  }
};

export const setUserStatus = (variables) => async dispatch => {
  try {
    dispatch(loading());
    console.log({ variables });
    const { data } = await graphQlClient.query({
      query: SET_USER_STATUS_QUERY,
      variables,
    });
    return dispatch(requestSuccess(SET_USER_STATUS, data.setUserStatus));
  } catch (error) {
    return dispatch(requestfailed(error.message));
  }
};
