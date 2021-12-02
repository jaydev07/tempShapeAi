import { CREATE_CATEGORIES_QUERY } from "./createCategory";
import { CREATE_NEW_COURSE_QUERY } from "./createNewCourse";
import { GET_INDIVIDUAL_COURSE_DATA_QUERY } from "./getIndividualCourse";
import { GET_ALL_COURSE_AND_CATEGORIES_QUERY } from "./getAllCourses";
import { GET_ALL_MODULES_QUERY } from "./getAllModules";
import { GET_TASK_DATA_QUERY } from "./getTask";
import { GET_SEARCH_COURSES_DATA_QUERY } from "./searchCourse";
import { GET_ALL_CATEGORIES_QUERY } from "./getAllCategories";
import { CREATE_MODULE_QUERY } from "./createModule";
import { CREATE_NEW_TASK_QUERY } from "./createNewTask";
import { UPDATE_UNIT_QUERY } from "./updateUnit";
import { CREATE_NEW_QUIZ_QUESTION_QUERY } from "./createQuizQuestion";
import { UPDATE_QUIZ_QUERY } from "./updateQuestion";
import { UPDATE_COURSE_QUERY } from "./updateCourseData";
import { UPDATE_MODULE_QUERY } from "./updateModule";
import { DELETE_MODULE_QUERY } from "./deleteModule";
import { DELETE_QUIZ_QUERY } from "./deleteQuiz.js";
import { PUBLISH_COURSE_QUERY } from "./publishCourse";
import { ARCHIVE_COURSE_QUERY } from "./archiveCourse";
import { DELETE_UNIT_QUERY } from "./deleteUnit";
import { UPLOAD_IMAGE_QUERY } from "./uploadImage";
import { UPLOAD_RESOURCES_QUERY } from "./uploadResources";
import { ADD_CERTIFICATE_QUERY } from "./addCertificate";
import { GET_CERTIFICATE_TEMPLATES_QUERY } from "./getCertificateTemplates";
import { ADD_CERTIFICATE_TEMPLATE_QUERY } from './addCertificateTemplate'
import { CREATE_CERTIFICATE_BATCH_QUERY } from './createCertificateBatch';
import { ADD_CERTIFICATE_EMAIL_TEMPLATES_QUERY } from './addCertificateEmailTemplate';
import { GET_CERTIFICATE_EMAIL_TEMPLATES_QUERY } from './getCertificateEmailTemplates';
import { GET_CERTIFICATE_BATCH_QUERY } from './getCertificateBatch';
import { GET_CERTIFICATE_BATCHES_QUERY } from './getCertificateBatches';

export {
  CREATE_CATEGORIES_QUERY,
  CREATE_NEW_COURSE_QUERY,
  GET_INDIVIDUAL_COURSE_DATA_QUERY,
  GET_ALL_COURSE_AND_CATEGORIES_QUERY,
  GET_ALL_CATEGORIES_QUERY,
  GET_ALL_MODULES_QUERY,
  GET_TASK_DATA_QUERY,
  GET_SEARCH_COURSES_DATA_QUERY,
  CREATE_MODULE_QUERY,
  CREATE_NEW_TASK_QUERY,
  CREATE_NEW_QUIZ_QUESTION_QUERY,
  UPDATE_UNIT_QUERY,
  UPDATE_QUIZ_QUERY,
  UPDATE_COURSE_QUERY,
  DELETE_MODULE_QUERY,
  DELETE_QUIZ_QUERY,
  UPDATE_MODULE_QUERY,
  PUBLISH_COURSE_QUERY,
  ARCHIVE_COURSE_QUERY,
  DELETE_UNIT_QUERY,
  UPLOAD_IMAGE_QUERY,
  UPLOAD_RESOURCES_QUERY,
  ADD_CERTIFICATE_QUERY,
  GET_CERTIFICATE_TEMPLATES_QUERY,
  ADD_CERTIFICATE_TEMPLATE_QUERY,
  CREATE_CERTIFICATE_BATCH_QUERY,
  GET_CERTIFICATE_EMAIL_TEMPLATES_QUERY,
  ADD_CERTIFICATE_EMAIL_TEMPLATES_QUERY,
  GET_CERTIFICATE_BATCHES_QUERY,
  GET_CERTIFICATE_BATCH_QUERY,
};
