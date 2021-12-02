import {
  LOGIN,
  REGISTER,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_IMAGE,
  UPDATE_XP,
  GET_CURRENT_USER,
  SET_USER_STATUS,
  GET_USER_STATE
} from "./user.type";
import { UPDATE_ENROLL_COURSE } from "../bootcamp/bootcamp.type";
import { REHYDRATE } from "../../../utils/global.utils";

const INITIAL_STATE = {
  token: "",
  user: {
    _id: "",
    profilePicture: {
      location:
        "https://uploads-ssl.webflow.com/5dd3495558fd7f3d1fcb52bc/603db7fe35f05b13f072cc41_illus13.svg",
      key: "default",
    },
    xp: 0,
    isVerified: false,
  },
  status: {
    hasSubmittedInitForm: true,
  },
  loading: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      };

    case LOGIN:
      return {
        ...state,
        token: action.payload.token,
        user: { ...state.user, ...action.payload.user },
        loading: false,
      };

    case REGISTER:
      return {
        ...state,
        token: action.payload.token,
        user: { ...state.user, ...action.payload.user },
        loading: false,
      };
    case UPDATE_ENROLL_COURSE:
      return {
        ...state,
        user: { ...state.user, enrolledCourseId: action.payload },
        loading: false,
      };

    case UPDATE_USER_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        loading: false,
      };

    case UPDATE_USER_PROFILE_IMAGE:
      return {
        ...state,
        user: { ...state.user, profilePicture: action.payload },
        loading: false,
      };

    case UPDATE_XP:
      return {
        ...state,
        user: {
          ...state.user,
          xp: state.user.xp + action.payload,
        },
        loading: false,
      };

    case GET_CURRENT_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    
    case SET_USER_STATUS:
      return {
        ...state,
        status: action.payload,
        loading: false
      };
      
    case GET_USER_STATE:
      return {
        ...state
      };

    case REHYDRATE:
      return action.payload ? action.payload.userReducer : INITIAL_STATE;

    default:
      return {
        ...state,
        loading: false,
      };
  }
};

export default userReducer;
