// Reducer Types
import {
  GET_BOOTCAMPS,
  GET_BOOTCAMPS_BY_SEARCH,
  GET_SINGAL_BOOTCAMPS,
  GET_ALL_MODULES,
  GET_TASK,
  ENROLL_COURSE,
  COMMIT_TASK,
  GET_COURSE_TRACKER,
  GET_CURRENT_TRACKER,
  UPDATE_ENROLL_COURSE,
  FETCH_COMMIT_DATA,
  UPLOAD_IMAGE,
  GENERATE_MODULE_CERTIFICATE,
} from "./bootcamp.type";

// GQL queries
import {
  GET_SEARCH_COURSES_DATA_QUERY,
  GET_ALL_COURSE_AND_CATEGORIES_QUERY,
  GET_SINGAL_BOOTCAMPS_QUERY,
  GET_ALL_MODULES_QUERY,
  GET_TASK_DATA_QUERY,
  ENROLL_COURSE_QUERY,
  COMMIT_TASK_QUERY,
  GET_COURSE_TRACKER_QUERY,
  GET_CURRENT_TRACKER_QUERY,
  FETCH_COMMIT_DATA_QUERY,
  UPLOAD_IMAGE_QUERY,
  GENERATE_MODULE_CERTIFICATE_QUERY,
} from "../../../gql/bootcamps";

// Apollo client
import graphQlClient from "../../../config/ApolloClient.config";

// Helper redux action
import { requestfailed } from "../Error/error.action";

// Utilities
import { requestSuccess, loading } from "../../../utils/global.utils";

// Action to get all bootcamps
export const getAllBootcampsAction = (pageNumber) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: GET_ALL_COURSE_AND_CATEGORIES_QUERY,
      variables: { page: pageNumber, query: { isDraft: false } },
    });

    return dispatch(requestSuccess(GET_BOOTCAMPS, data));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to get all searched bootcamps
export const getSearchedBootcampsAction = (
  searchString,
  searchType = "name"
) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: GET_SEARCH_COURSES_DATA_QUERY,

      // searchType specifies whether the search is based on name or category. Default is name
      variables: { query: { [searchType]: searchString, isDraft: false } },
    });
    console.log({ data });
    return dispatch(requestSuccess(GET_BOOTCAMPS_BY_SEARCH, data));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to fetch individual course data
export const getSingleBootCampAction = (Id, _id, isDraft = false) => async (
  dispatch
) => {
  try {
    const variables = { Id, _id, isDraft };
    if (!Id) delete variables.Id;
    if (!_id) delete variables._id;
    dispatch(loading());

    const { data } = await graphQlClient.query({
      query: GET_SINGAL_BOOTCAMPS_QUERY,
      variables,
    });
    return dispatch(requestSuccess(GET_SINGAL_BOOTCAMPS, data.getCourse));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to fetch All modules of a specific bootcamp
export const getAllModulesAction = (courseId, ids) => async (dispatch) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.query({
      query: GET_ALL_MODULES_QUERY,
      variables: { courseId, ids },
    });

    if (data) return dispatch(requestSuccess(GET_ALL_MODULES, data.getModules));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to get task details
export const getTaskAction = (id) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: GET_TASK_DATA_QUERY,
      variables: { id },
    });
    return dispatch(requestSuccess(GET_TASK, data.getTask));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to enroll in a course
export const enrollCourseAction = (id, CourseId) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.mutate({
      mutation: ENROLL_COURSE_QUERY,
      variables: { id },
    });
    dispatch(requestSuccess(UPDATE_ENROLL_COURSE, CourseId));
    return dispatch(requestSuccess(ENROLL_COURSE, data.enrollCourse));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to commit tasks
export const commitTaskAction = (id) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.mutate({
      mutation: COMMIT_TASK_QUERY,
      variables: { id },
    });
    return dispatch(requestSuccess(COMMIT_TASK, data.commitTask));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to get course tracking data
export const getCourseTrackingDataAction = (course) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: GET_COURSE_TRACKER_QUERY,
      variables: { course },
    });
    return dispatch(requestSuccess(GET_COURSE_TRACKER, data.getCourseTracker));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to get current course tracking data
export const getCurrentTrackingDataAction = () => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: GET_CURRENT_TRACKER_QUERY,
    });
    return dispatch(
      requestSuccess(GET_CURRENT_TRACKER, data.getCurrentTracker)
    );
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to get commits of the student --> (Heatmap data)
export const getCommitsDataAction = (userId) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.query({
      query: FETCH_COMMIT_DATA_QUERY,
    });
    return dispatch(requestSuccess(FETCH_COMMIT_DATA, data.getHeatmapData));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to upload image
export const uploadImageAction = (purpose, files) => async (dispatch) => {
  try {
    const { data } = await graphQlClient.mutate({
      mutation: UPLOAD_IMAGE_QUERY,
      variables: { purpose, files },
    });

    if (data) return dispatch(requestSuccess(ARCHIVE_COURSE, data));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to generate module certificate
export const generateModuleCertAction = (moduleId) => async (dispatch) => {
  console.log({ moduleId });
  try {
    const { data } = await graphQlClient.mutate({
      mutation: GENERATE_MODULE_CERTIFICATE_QUERY,
      variables: { moduleId },
    });

    if (data)
      return dispatch(
        requestSuccess(
          GENERATE_MODULE_CERTIFICATE,
          data.generateModuleCertificate
        )
      );
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};
