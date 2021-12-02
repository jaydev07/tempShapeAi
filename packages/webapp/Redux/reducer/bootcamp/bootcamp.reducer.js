import {
  GET_BOOTCAMPS,
  GET_BOOTCAMPS_BY_SEARCH,
  GET_SINGAL_BOOTCAMPS,
  GET_ALL_MODULES,
} from "./bootcamp.type";
import { REHYDRATE } from "../../../utils/global.utils";

const INITIAL_STATE = {
  bootcampList: [],
  categories: [],
  loading: false,
  selectedBootcamp: {},
  modules: [],
};

const bootcampReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      };

    case GET_BOOTCAMPS:
      return {
        ...state,
        loading: false,
        bootcampList: action.payload.getCourses.courses,
        categories: action.payload.getCategories,
      };

    case GET_BOOTCAMPS_BY_SEARCH:
      return {
        ...state,
        loading: false,
        bootcampList: action.payload.getCourses.courses,
      };

    case GET_SINGAL_BOOTCAMPS:
      return {
        ...state,
        loading: false,
        selectedBootcamp: action.payload,
      };

    case GET_ALL_MODULES:
      return {
        ...state,
        loading: false,
        modules: action.payload,
      };

    case REHYDRATE:
      return action.payload ? action.payload.bootcampReducer : INITIAL_STATE;

    default:
      return {
        ...state,
        loading: false,
      };
  }
};

export default bootcampReducer;
