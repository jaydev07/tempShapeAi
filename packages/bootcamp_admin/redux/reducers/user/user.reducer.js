import {
  LOGIN,
} from "./user.type";
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
  type: '',
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

    case REHYDRATE:
      return action.payload ? action.payload.user : INITIAL_STATE;
      
    default:
      return {
        ...state,
        loading: false,
      };
  }
};

export default userReducer;
