import {
  START_NEW_COURSE,
  GET_ALL_COURSE_AND_CATEGORIES,
  GET_INDIVIDUAL_COURSE_DATA,
  GET_ALL_CATEGORIES,
  CREATE_CATEGORY,
  CREATE_MODULE,
  CREATE_COURSE,
  DELETE_MODULE,
  DELETE_COURSE,
  ADD_QUIZ_QUESTIONS,
  UPDATE_UNIT,
  UPDATE_COURSE,
  CREATE_TASK,
  GET_ALL_MODULES,
  DELETE_UNIT,
  UPDATE_MODULE_RESOURCES,
} from "./courses.type";
import { REHYDRATE } from "../../../utils/global.utils";
const INITIAL_STATE = {
  courses: [],
  categories: [],
  newCourse: { name: "", description: "", category: "", modules: [] },
  loading: false,
  individualCourse: {},
  modules: [],
  quizQuestionCollections: [],
  certificateTemplates: []
};

const courseReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      };

    case START_NEW_COURSE:
      return {
        ...state,
        loading: false,
      };

    case GET_ALL_COURSE_AND_CATEGORIES:
      return {
        ...state,
        courses: action.payload.getCourses.courses,
        categories: action.payload.getCategories,
        loading: false,
      };

    case GET_ALL_CATEGORIES:
      return {
        ...state,
        categories: action.payload.getCategories,
        loading: false,
      };

    case GET_ALL_MODULES:
      return {
        ...state,
        modules: action.payload,
        loading: false,
      };

    case GET_INDIVIDUAL_COURSE_DATA:
      return {
        ...state,
        newCourse: action.payload,
        loading: false,
      };

    case CREATE_COURSE:
      return {
        ...state,
        newCourse: action.payload,
        loading: false,
      };

    case CREATE_CATEGORY:
      return {
        ...state,
        newCourse: {
          ...state.newCourse,
          category: action.payload.createCategory._id,
        },
        loading: false,
      };

    case CREATE_MODULE:
      return {
        ...state,
        modules:
          state.modules.length > 0
            ? [...state.modules, action.payload]
            : [action.payload],
        loading: false,
      };
    case UPDATE_MODULE_RESOURCES:
      const stateClone = { ...state };
      const modulesClone = [...stateClone.modules];
      modulesClone.forEach(
        (mod) =>
          mod._id === action.payload._id && {
            ...mod,
            resources: action.payload.resources,
          }
      );
      return {
        ...state,
        modules: modulesClone,
        loading: false,
      };
    case ADD_QUIZ_QUESTIONS:
      return {
        ...state,
        quizQuestionCollections:
          state.quizQuestionCollections.length > 0
            ? [action.payload, ...state.quizQuestionCollections]
            : [action.payload],
        loading: false,
      };

    case UPDATE_COURSE:
      return {
        ...state,
        newCourse: action.payload,
        loading: false,
      };

    case DELETE_COURSE:
      return {
        ...state,
        courses: state.courses.filter(({ Id }) => Id !== action.payload),
      };

    case DELETE_MODULE:
      return {
        ...state,
        modules:
          state.modules.length > 0 &&
          state.modules.filter(({ _id }) => _id !== action.payload),
        loading: false,
      };

    case CREATE_TASK:
      return {
        ...state,
        loading: false,
        modules:
          state.modules.length > 0 &&
          state.modules.map((module) => {
            if (module._id === action.payload.module) {
              return {
                ...module,
                units:
                  module.units.length > 0
                    ? [
                        ...module.units,
                        {
                          type: "CourseTask",
                          unit: action.payload,
                        },
                      ]
                    : [
                        {
                          type: "CourseTask",
                          unit: action.payload,
                        },
                      ],
              };
            }
            return module;
          }),
      };
    case DELETE_UNIT:
      return {
        ...state,
        loading: false,
        modules:
          state.modules.length > 0 &&
          state.modules.map((module) => {
            if (module._id === action.payload.prentModule) {
              return {
                ...module,
                units:
                  module.units.length &&
                  module.units.filter(
                    ({ unit }) => unit._id !== action.payload.id
                  ),
              };
            }
            return module;
          }),
      };

    case REHYDRATE:
      return action.payload ? action.payload.courses : INITIAL_STATE;

    default:
      return {
        ...state,
        loading: false,
      };
  }
};

export default courseReducer;
