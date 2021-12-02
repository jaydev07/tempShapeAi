import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

import { Container, Button } from "reactstrap";

// Components
import CourseEdit from "../../../components/CourseEdit/CourseEdit";

// Redux Actions
import {
  updateCourseDetailsAction,
  getAllIndividualCourseAction,
  getAllCategories,
} from "../../../redux/reducers/courses/courses.action";

import "../../../assets/scss/courses/create.module.scss";

const CreateCourse = () => {
  const [courseData, setCourseData] = useState({});
  const [categoryList, setCategoryList] = useState([
    { value: "Loading..", label: "Loading.." },
  ]);

  const dispatch = useDispatch();
  const router = useRouter();
  const { courseId } = router.query;

  useEffect(() => {
    const getAllCourseData = async () => {
      const { payload } = await dispatch(
        getAllIndividualCourseAction(courseId)
      );
      setCourseData(payload);
      const getAllCategoriesAction = await dispatch(getAllCategories());
      setCategoryList(
        getAllCategoriesAction.payload.getCategories.map(({ name, _id }) => ({
          value: name,
          label: name,
          _id,
        }))
      );
    };

    getAllCourseData();
  }, []);

  const saveCourseEdit = async () => {
    const {
      _id,
      name,
      prerequisites,
      tags,
      skills,
      category,
      image,
    } = courseData;

    const { payload } = await dispatch(
      updateCourseDetailsAction({
        name,
        prerequisites,
        tags,
        skills,
        id: _id,
        category,
        image,
      })
    );
    return setCourseData({ ...courseData, ...payload });
  };

  const redirectToLessons = () =>
    router.push(`/courses/edit/lessons/${courseData._id}`);

  return (
    <>
      <Container className="mt-4">
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h1>Edit Course Details</h1>
          <Button outline color="primary" onClick={redirectToLessons}>
            Add/Edit Lessons <i className="fas fa-arrow-right" />
          </Button>
        </div>
        <CourseEdit
          setCourseData={setCourseData}
          courseData={courseData}
          categoryList={categoryList}
          saveCourseEdit={saveCourseEdit}
        />
      </Container>
    </>
  );
};

export default CreateCourse;
