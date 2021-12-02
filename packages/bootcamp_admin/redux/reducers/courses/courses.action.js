// Types
import {
  START_NEW_COURSE,
  GET_ALL_COURSE_AND_CATEGORIES,
  GET_INDIVIDUAL_COURSE_DATA,
  SEARCH_COURSE,
  CREATE_CATEGORY,
  CREATE_COURSE,
  CREATE_MODULE,
  CREATE_TASK,
  DELETE_MODULE,
  DELETE_COURSE,
  UPDATE_UNIT,
  ADD_QUIZ_QUESTIONS,
  GET_ALL_CATEGORIES,
  UPDATE_COURSE,
  GET_ALL_MODULES,
  UPDATE_MODULE,
  UPDATE_QUIZ,
  DELETE_QUIZ_QUESTION,
  PUBLISH_COURSE,
  ARCHIVE_COURSE,
  GET_TASK,
  DELETE_UNIT,
  ADD_CERTIFICATE,
  UPDATE_MODULE_RESOURCES,
  GET_CERTIFICATE_TEMPLATES,
} from "./courses.type";

// Apollo client
import graphQlClient from "../../../configs/ApolloClient.config";

// Queries
import {
  GET_ALL_COURSE_AND_CATEGORIES_QUERY,
  GET_INDIVIDUAL_COURSE_DATA_QUERY,
  GET_SEARCH_COURSES_DATA_QUERY,
  CREATE_CATEGORIES_QUERY,
  CREATE_NEW_COURSE_QUERY,
  CREATE_MODULE_QUERY,
  CREATE_NEW_TASK_QUERY,
  CREATE_NEW_QUIZ_QUESTION_QUERY,
  UPDATE_UNIT_QUERY,
  DELETE_MODULE_QUERY,
  UPDATE_QUIZ_QUERY,
  DELETE_QUIZ_QUERY,
  GET_ALL_CATEGORIES_QUERY,
  UPDATE_COURSE_QUERY,
  GET_ALL_MODULES_QUERY,
  UPDATE_MODULE_QUERY,
  PUBLISH_COURSE_QUERY,
  ARCHIVE_COURSE_QUERY,
  GET_TASK_DATA_QUERY,
  DELETE_UNIT_QUERY,
  UPLOAD_IMAGE_QUERY,
  UPLOAD_RESOURCES_QUERY,
  ADD_CERTIFICATE_QUERY,
  GET_CERTIFICATE_TEMPLATES_QUERY,
} from "../../../gql/courses";

// Error Action
import { requestfailed } from "../Error/error.action";

// Utilities
import { requestSuccess, loading } from "../../../utils/global.utils";

// Action to fetch all exisiting course
export const getAllCourseAndCategoriesAction = (page) => async (
  dispatch,
  getState
) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.query({
      query: GET_ALL_COURSE_AND_CATEGORIES_QUERY,
      variables: { page, query: { isDraft: true } },
    });
    return dispatch(requestSuccess(GET_ALL_COURSE_AND_CATEGORIES, data));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to get All Categories
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.query({
      query: GET_ALL_CATEGORIES_QUERY,
    });
    return dispatch(requestSuccess(GET_ALL_CATEGORIES, data));
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

// Action to fetch individual course data
export const getAllIndividualCourseAction = (_id) => async (
  dispatch,
  getState
) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.query({
      query: GET_INDIVIDUAL_COURSE_DATA_QUERY,
      variables: { _id },
    });
    return dispatch(requestSuccess(GET_INDIVIDUAL_COURSE_DATA, data.getCourse));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to fetch course based on search
export const getSearchBasedCourseAction = (searchObject) => async (
  dispatch
) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.query({
      query: GET_SEARCH_COURSES_DATA_QUERY,
      variables: { searchObject },
    });
    return dispatch(requestSuccess(SEARCH_COURSE, data));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to fetch create new category
export const createCategoryAction = (categoryName, categoryList) => async (
  dispatch
) => {
  try {
    dispatch(loading());

    const doesCategoryExisit = categoryList.filter(
      ({ value }) => value === categoryName
    );

    console.log({ doesCategoryExisit });

    if (doesCategoryExisit.length)
      return dispatch(
        requestSuccess(CREATE_CATEGORY, {
          createCategory: { _id: doesCategoryExisit[0]._id },
        })
      );

    const { data } = await graphQlClient.mutate({
      mutation: CREATE_CATEGORIES_QUERY,
      variables: { name: categoryName },
    });
    return dispatch(requestSuccess(CREATE_CATEGORY, data));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action To create a course
export const createCourseAction = (courseData) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.mutate({
      mutation: CREATE_NEW_COURSE_QUERY,
      variables: { course: courseData },
    });
    return dispatch(requestSuccess(CREATE_COURSE, data.createCourse));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to create a new module to an exisiting course
export const createNewModuleAction = (moduleData) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.mutate({
      mutation: CREATE_MODULE_QUERY,
      variables: { module: moduleData },
    });
    return dispatch(requestSuccess(CREATE_MODULE, data.createModule));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to start creating a new course
export const startNewCourseAction = (courseData, categoryList) => async (
  dispatch
) => {
  try {
    dispatch(loading());
    const categoryData = await dispatch(
      createCategoryAction(courseData.selectedCategories, categoryList)
    );
    const course = await dispatch(
      createCourseAction({
        category: categoryData.payload.createCategory._id,
        description: courseData.description,
        name: courseData.name,
        prerequisites: courseData.prerequisites,
        type: "bootcamp",
        Id: courseData.Id,
      })
    );

    return dispatch(requestSuccess(START_NEW_COURSE, course.payload));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to create New task
export const createNewTask = (taskData) => async (dispatch) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.mutate({
      mutation: CREATE_NEW_TASK_QUERY,
      variables: { task: taskData },
    });

    return dispatch(requestSuccess(CREATE_TASK, data.createTask));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to update an exisiting unit
export const updateUnitAction = ({ id, content }) => async (dispatch) => {
  try {
    const { data } = await graphQlClient.mutate({
      mutation: UPDATE_UNIT_QUERY,
      variables: { id, content },
    });
    return dispatch(requestSuccess(UPDATE_UNIT, data));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to update Course Details
export const updateCourseDetailsAction = (courseData) => async (dispatch) => {
  console.log({ courseData });
  try {
    const { data } = await graphQlClient.mutate({
      mutation: UPDATE_COURSE_QUERY,
      variables: courseData,
    });
    return dispatch(requestSuccess(UPDATE_COURSE, data.updateCourseDetails));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to update quiz
export const updateQuizAction = (id, quizQuestions) => async (dispatch) => {
  try {
    const question = {
      question: quizQuestions.question,
      correctAnswers: quizQuestions.rightAnswer.map((answer) =>
        parseInt(answer)
      ),
      answers: [
        { answerBody: quizQuestions["1"], optionNumber: 1 },
        { answerBody: quizQuestions["2"], optionNumber: 2 },
        { answerBody: quizQuestions["3"], optionNumber: 3 },
        { answerBody: quizQuestions["4"], optionNumber: 4 },
      ],
    };

    const { data } = await graphQlClient.mutate({
      mutation: UPDATE_QUIZ_QUERY,
      variables: { id, question },
    });

    return dispatch(requestSuccess(UPDATE_QUIZ, data.updateQuestion));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to add quiz questions to an exisiting quiz
export const addNewQuizQuestionAction = (quizQuestions, quizId) => async (
  dispatch
) => {
  try {
    dispatch(loading());

    const questions = {
      question: quizQuestions.question,
      correctAnswers: quizQuestions.rightAnswer.map((answer) =>
        parseInt(answer)
      ),
      answers: [
        { answerBody: quizQuestions["1"], optionNumber: 1 },
        { answerBody: quizQuestions["2"], optionNumber: 2 },
        { answerBody: quizQuestions["3"], optionNumber: 3 },
        { answerBody: quizQuestions["4"], optionNumber: 4 },
      ],
    };

    const { data } = await graphQlClient.mutate({
      mutation: CREATE_NEW_QUIZ_QUESTION_QUERY,
      variables: { questions, quizId },
    });

    return dispatch(requestSuccess(ADD_QUIZ_QUESTIONS, data.addQuestions));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to delete a module
export const deleteModuleAction = (id) => async (dispatch) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.mutate({
      mutation: DELETE_MODULE_QUERY,
      variables: { id },
    });
    if (data.deleteModule !== null)
      return dispatch(requestSuccess(DELETE_MODULE, id));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to delete Unit
export const deleteUnitAction = (id, prentModule) => async (dispatch) => {
  console.log({ id });
  try {
    dispatch(loading());

    const { data } = await graphQlClient.mutate({
      mutation: DELETE_UNIT_QUERY,
      variables: { id },
    });
    if (data.deleteModule !== null)
      return dispatch(
        requestSuccess(DELETE_UNIT, {
          id,
          prentModule,
          status: data.deleteTask,
        })
      );
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to delete course
export const deleteCourseAction = (id) => async (dispatch) => {
  try {
    return dispatch(requestSuccess(DELETE_COURSE, id));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to delete Quiz
export const deleteQuizAction = (id) => async (dispatch) => {
  try {
    dispatch(loading());
    const { data } = await graphQlClient.mutate({
      mutation: DELETE_QUIZ_QUERY,
      variables: { id },
    });

    return dispatch(requestSuccess(DELETE_QUIZ_QUESTION, data.deleteQuestion));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to fetch All modules of a specific bootcamp
export const getAllModulesAction = (courseId) => async (dispatch) => {
  try {
    dispatch(loading());

    const { data } = await graphQlClient.query({
      query: GET_ALL_MODULES_QUERY,
      variables: { courseId },
    });

    if (data) return dispatch(requestSuccess(GET_ALL_MODULES, data.getModules));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to update module details
export const updateModuleDetailsAction = (modifiedData) => async (dispatch) => {
  try {
    const { data } = await graphQlClient.mutate({
      mutation: UPDATE_MODULE_QUERY,
      variables: modifiedData,
    });

    if (data)
      return dispatch(requestSuccess(UPDATE_MODULE, data.updateModuleDetails));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to publish course
export const publishCourseAction = (id) => async (dispatch) => {
  try {
    const { data } = await graphQlClient.mutate({
      mutation: PUBLISH_COURSE_QUERY,
      variables: { id },
    });

    if (data)
      return dispatch(requestSuccess(PUBLISH_COURSE, data.publishCourse));
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to archieve course
export const archiveCourseAction = (Id, archive) => async (dispatch) => {
  try {
    const { data } = await graphQlClient.mutate({
      mutation: ARCHIVE_COURSE_QUERY,
      variables: { Id, archive },
    });

    if (data)
      return dispatch(
        requestSuccess(ARCHIVE_COURSE, data.changeCourseArchiveStatus)
      );
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

// Action to handle resources
export const updateModuleResources = (
  id,
  action,
  resources,
  resourceIds,
  newName
) => async (dispatch) => {
  try {
    const { data } = await graphQlClient.mutate({
      mutation: UPLOAD_RESOURCES_QUERY,
      variables: { id, action, resources, resourceIds, newName },
    });
    if (data)
      return dispatch(
        requestSuccess(UPDATE_MODULE_RESOURCES, data.updateModuleResources)
      );
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to add certificate
export const addCertficateAction = () => async (dispatch) => {
  const certificate = {
    name: "module-1",
    dimensions: {
      height: 495,
      width: 640,
    },
    imageUrl:
      "https://shapeai-uploads.s3.ap-south-1.amazonaws.com/templates/module-1.png",
    type: "generic",
  };
  try {
    const { data } = await graphQlClient.mutate({
      mutation: ADD_CERTIFICATE_QUERY,
      variables: { certificate },
    });
    if (data)
      return dispatch(
        requestSuccess(ADD_CERTIFICATE, data.addCertificateTemplate)
      );
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};

// Action to add certificate
export const getCertficateTemplateAction = (type) => async (dispatch) => {
  try {
    const { data } = await graphQlClient.query({
      query: GET_CERTIFICATE_TEMPLATES_QUERY,
      variables: { type: type || 'generic' }
    });
    if (data)
      return dispatch(
        requestSuccess(GET_CERTIFICATE_TEMPLATES, data.getCertificateTemplates)
      );
  } catch (error) {
    return dispatch(requestfailed(error));
  }
};
