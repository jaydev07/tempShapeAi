import React, { useState, useEffect } from "react";
import { Modal, ModalBody, Label, Spinner } from "reactstrap";
import Button from "reactstrap/lib/Button";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

// Components
import InputField from "../FormFields/FormikForms/InputFields";
import CreatableSelect from "../FormFields/CreateableSelectField";

// Redux Action
import {
  startNewCourseAction,
  createCategoryAction,
  getAllCategories,
} from "../../redux/reducers/courses/courses.action";

const CreateNewCourse = ({ modalOpen, setModalOpen }) => {
  const [categoryList, setCategoryList] = useState([
    { value: "Loading..", label: "Loading.." },
  ]);
  const [selectedCategories, setSelectedcategories] = useState("");
  const [image, setImage] = useState({ key: "", location: "" });

  const reduxState = useSelector(({ courses }) => ({ courses }));

  const dispatch = useDispatch();
  const router = useRouter();

  const loadCategories = async () => {
    const { payload } = await dispatch(getAllCategories());
    setCategoryList(
      payload.getCategories.map(({ name, _id }) => ({
        value: name,
        label: name,
        _id,
      }))
    );
  };

  useEffect(() => loadCategories(), []);

  return (
    <>
      <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
        <div className=" modal-header">
          <h5 className=" modal-title" id="exampleModalLabel">
            Create New Course
          </h5>
          <button
            aria-label="Close"
            className=" close"
            type="button"
            onClick={() => setModalOpen(!modalOpen)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <ModalBody className="bg-secondary">
          <Formik
            initialValues={{
              name: "",
              description: "",
              prerequisites: "",
              Id: "",
              isProject: false,
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(async () => {
                setSubmitting(false);

                const payload = {
                  ...values,
                  selectedCategories,
                  image,
                };

                const data = await dispatch(
                  startNewCourseAction(payload, categoryList)
                );

                if (data.payload)
                  router.push(`/courses/edit/${data.payload._id}`);
                setModalOpen(!modalOpen);
              }, 400);
            }}
          >
            <Form>
              <div>
                <Label className="text-gray font-weight-700">Course Id</Label>
                <InputField
                  placeholder="Course Id"
                  name="Id"
                  id="Id"
                  type="text"
                  alt
                />
              </div>
              <div>
                <Label className="text-gray font-weight-700">Course Name</Label>
                <InputField
                  placeholder="Course Name"
                  name="name"
                  id="name"
                  type="text"
                  alt
                />
              </div>
              <div>
                <Label className="text-gray font-weight-700">Description</Label>
                <InputField
                  placeholder="Description"
                  name="description"
                  id="description"
                  type="textarea"
                  alt
                />
              </div>
              <div>
                <Label className="text-gray font-weight-700">
                  Prerequisites
                </Label>
                <InputField
                  placeholder="Prerequisites"
                  name="prerequisites"
                  id="prerequisites"
                  type="text"
                  alt
                />
              </div>
              <div>
                <CreatableSelect
                  onChange={(value) => setSelectedcategories(value.value)}
                  options={categoryList}
                  placeholder="Select Categories"
                  name="categories"
                  id="categories"
                  label="Category"
                  isCreatable
                />
              </div>

              <div className="mt-4 mb-2 d-flex justify-content-end">
                <Button
                  color="secondary"
                  type="button"
                  onClick={() => setModalOpen(!modalOpen)}
                >
                  Close
                </Button>
                <Button color="primary" type="submit">
                  {reduxState.courses.loading ? (
                    <Spinner size="sm" />
                  ) : (
                    "Create Course"
                  )}
                </Button>
              </div>
            </Form>
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateNewCourse;
