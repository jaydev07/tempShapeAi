import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import {
  Container,
  Modal,
  ModalBody,
  Form,
  Input,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  UncontrolledCollapse,
  Card,
  CardImg,
  Row,
  Col,
  CardFooter,
} from "reactstrap";
import Link from "next/link";
import { toast } from "react-toastify";

// Components
import ModuleCard from "../../../../components/ModuleComps/ModuleCard";

// Redux Actions
import {
  createNewModuleAction,
  getAllModulesAction,
  getCertficateTemplateAction,
} from "../../../../redux/reducers/courses/courses.action";
import { clearError } from "../../../../redux/reducers/Error/error.action";

const CourseLessons = () => {
  const [modulesData, setModulesData] = useState([]);
  const [toggleModal, setToggleModal] = useState(false);
  const [newModuleData, setNewModuleData] = useState({
    name: "",
    description: "",
    isProjectModule: false,
    isCertifiedModule: "",
  });
  const [certficateList, setCertificateList] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const { courseId } = router.query;

  useEffect(() => {
    const getAllModulesData = async () => {
      const { payload } = await dispatch(getAllModulesAction(courseId));
      if (payload.length) setModulesData(payload.filter(({ isSub }) => !isSub));

      const certificateTemplate = await dispatch(getCertficateTemplateAction());
      setCertificateList(certificateTemplate.payload);
    };

    getAllModulesData();
    return dispatch(clearError());
  }, [courseId]);

  const handleNewModuleChange = (e) =>
    setNewModuleData({ ...newModuleData, [e.target.name]: e.target.value });

  const addNewLesson = async (e) => {
    e.preventDefault();
    setToggleModal(!toggleModal);

    let data = {
      name: newModuleData.name,
      description: newModuleData.description,
      course: courseId,
      isSub: false,
      parentModule: null,
      isProjectModule: newModuleData.isProjectModule,
      isOptionModule: false,
      isCertificateAvailable: Boolean(newModuleData.isCertifiedModule),
      certificateTemplate: newModuleData.isCertifiedModule
        ? newModuleData.isCertifiedModule
        : null,
    };
    const { payload } = await dispatch(createNewModuleAction(data));
    toast.success("Lesson created");
    setNewModuleData({
      name: "",
      description: "",
      isProjectModule: false,
      isCertifiedModule: "",
    });
    return setModulesData(modulesData.concat(payload));
  };

  return (
    <>
      <Modal isOpen={toggleModal} toggle={() => setToggleModal(!toggleModal)}>
        <ModalBody className="bg-secondary">
          <Form onSubmit={addNewLesson}>
            <Input
              className="my-2 input-group-alternative"
              type="text"
              name="name"
              value={newModuleData.name}
              onChange={handleNewModuleChange}
              placeholder="Lesson name"
              required
            />
            <Input
              className="my-2 input-group-alternative"
              type="textarea"
              name="description"
              value={newModuleData.description}
              placeholder="Lesson description"
              rows="6"
              onChange={handleNewModuleChange}
            />
            <div className="my-2  custom-control custom-checkbox mb-3">
              <input
                className=" custom-control-input"
                id="customCheck1"
                type="checkbox"
                onChange={() =>
                  setNewModuleData({
                    ...newModuleData,
                    isProjectModule: !newModuleData.isProjectModule,
                  })
                }
              ></input>
              <label className=" custom-control-label" htmlFor="customCheck1">
                <span>Is this a project lesson</span>
              </label>
            </div>
           
            <Button className="my-2" type="submit" color="primary">
              Create New Lesson
            </Button>
          </Form>
        </ModalBody>
      </Modal>
      <Container className="mt-4">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link href={`/courses/edit/${courseId}`}>Course</Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Lesson</BreadcrumbItem>
        </Breadcrumb>
        <div className="mb-3 d-flex justify-content-between align-items-center">
          <h1>Course Lessons</h1>
          <Button
            className="btn-icon btn-3"
            color="primary"
            outline
            type="button"
            onClick={() => setToggleModal(!toggleModal)}
          >
            <span className="btn-inner--icon">
              <i className="fas fa-plus-circle"></i>
            </span>
            <span className="btn-inner--text">Add Lessons</span>
          </Button>
        </div>
        {modulesData.map((module) => (
          <ModuleCard
            {...module}
            setModulesData={setModulesData}
            modulesData={modulesData}
          />
        ))}
      </Container>
    </>
  );
};

export default CourseLessons;
