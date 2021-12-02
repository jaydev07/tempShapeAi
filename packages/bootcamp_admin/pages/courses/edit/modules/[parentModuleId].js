import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

import moment from "moment";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  CardHeader,
  Breadcrumb,
  BreadcrumbItem,
  Badge,
} from "reactstrap";

// Components
import MarkDownEditor from "../../../../components/MarkDownEditor/Editor";
import QuizPreviewComponent from "../../../../components/QuizComponent/QuizPreviewComponent";
import QuizCreateComponent from "../../../../components/QuizComponent/QuizCreateComponent";
import GenerateModuleLists from "../../../../components/ModuleComps/GenerateModuleLists";
import ModuleResources from "../../../../components/ModuleResources/";
import CreateModuleModal from "../../../../components/ModuleComps/CreateModuleModal";
import CertificateCreator from "../../../../components/CertificateList/";

// Redux Actions
import {
  createNewModuleAction,
  updateUnitAction,
  getAllModulesAction,
  updateModuleDetailsAction,
  deleteQuizAction,
  archiveCourseAction,
} from "../../../../redux/reducers/courses/courses.action";

// Utilities

/*
We are importing a temporary module process for now, so that we can impose restriction
to deeply nested modules(uptill level 3 for now), anyway to handle infinite nested module, 
you can import module processor from the path "../../../../utils/CreateCourse/", 
the processor in this path has the capabilities to handle and organize any level of nested modules.
*/
import {
  processModules,
  debounce,
} from "../../../../utils/CreateCourse/tempModuleProcessor";

import "../../../../assets/scss/courses/create.module.scss";

const EditorPage = () => {
  const [newModule, setNewModule] = useState("");
  const [courseData, setCourseData] = useState({});

  const [isSaving, setIsSaving] = useState(false);
  const [modulesList, setModuleList] = useState({
    parent: [],
    sub: [],
    raw: [],
    parentMod: {},
  });
  const [toggleModule, setToggleModule] = useState(false);
  const [quizQuestionCollections, setQuizQuestionCollections] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState({
    id: 0,
    question: "",
    1: "",
    2: "",
    3: "",
    4: "",
    rightAnswer: [],
  });

  const [focusModule, setFocusModule] = useState({ details: { content: "" } });
  const dispatch = useDispatch();
  const router = useRouter();
  const { parentModuleId } = router.query;

  const reduxState = useSelector(({ courses }) => ({ courses }));

  useEffect(() => {
    if (!reduxState.courses.newCourse.name) router.push("/courses");

    const loadData = async () => {
      setCourseData(reduxState.courses.newCourse);
      const getModules = await dispatch(
        getAllModulesAction(reduxState.courses.newCourse._id)
      );

      getModules.payload.filter(
        ({ parentModule }) => parentModule === parentModuleId
      );

      setModuleList({
        ...processModules(getModules.payload),
        parentMod: getModules.payload.filter(
          ({ _id }) => _id === parentModuleId
        )[0],
        raw: getModules.payload,
      });
    };

    loadData();
  }, [parentModuleId]);

  useEffect(() => {
    reduxState.courses.modules.filter(
      ({ parentModule }) => parentModule === parentModuleId
    );

    setModuleList({
      ...processModules(reduxState.courses.modules),
      parentMod: reduxState.courses.modules.filter(
        ({ _id }) => _id === parentModuleId
      )[0],
      raw: reduxState.courses.modules,
    });
  }, [reduxState.courses]);

  const debounceMarkDownData = useCallback(
    debounce((value) => {
      return saveEdit(1, value);
    }, 2000),
    []
  );

  const debounceModuleNameDescription = useCallback(
    debounce((value) => {
      return saveEdit(null, null, value);
    }, 2000),
    []
  );

  const handleMarkDownChange = (value) => {
    setFocusModule({
      ...focusModule,
      details: { ...focusModule.details, content: value },
    });

    return debounceMarkDownData({
      id: focusModule.details._id,
      content: value,
      module: focusModule.module,
    });
  };

  const handlefocusModuleChange = (e) => {
    setFocusModule({ ...focusModule, [e.target.name]: e.target.value });
    return debounceModuleNameDescription({
      ...focusModule,
      [e.target.name]: e.target.value,
    });
  };
  const changeArchiveStatus = async () =>
    dispatch(archiveCourseAction(courseData._id, courseData.isArchived));

  const saveEdit = async (e, unitContent, moduleContent) => {
    // Save modules / sub-modules
    if (moduleContent) {
      const saveModules = modulesList.raw.map((module) => {
        if (module._id === moduleContent._id) {
          return {
            ...module,
            name: moduleContent.name,
            description: moduleContent.description,
          };
        }
        return module;
      });
      setModuleList({
        ...modulesList,
        ...processModules(saveModules),
        raw: saveModules,
      });

      return await dispatch(
        updateModuleDetailsAction({
          id: moduleContent._id,
          name: moduleContent.name,
          description: moduleContent.description,
        })
      );
    }

    // Save unit
    if (unitContent) {
      return await dispatch(updateUnitAction(unitContent));
    }
  };

  const DeleteQuiz = async (e) => {
    const { payload } = await dispatch(deleteQuizAction(e.target.id));

    if (payload) {
      setQuizQuestionCollections(
        quizQuestionCollections.filter((quiz) => quiz._id !== e.target.id)
      );
      setSelectedQuiz({
        id: quizQuestionCollections.length + 1,
        question: "",
        1: "",
        2: "",
        3: "",
        4: "",
        rightAnswer: [],
      });
    }
  };

  const Editquiz = (e) => {
    const getQuizData = quizQuestionCollections.filter(
      (quiz) => quiz._id === e.target.id
    );

    setSelectedQuiz(
      getQuizData.map(({ _id, question, answers, correctAnswers }) => ({
        _id,
        question,
        1: answers[0].answerBody,
        2: answers[1].answerBody,
        3: answers[2].answerBody,
        4: answers[3].answerBody,
        rightAnswer: correctAnswers,
      }))[0]
    );
  };

  return (
    <Container className="mt-4" fluid>
      <CreateModuleModal
        toggleModal={toggleModule}
        setToggleModal={setToggleModule}
        modulesList={modulesList}
        setModuleList={setModuleList}
        disableUnits
        _id={parentModuleId}
        focusModule={focusModule}
        parentModule={modulesList.parentMod}
      />
      <Container>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link href={`/courses/edit/${reduxState.courses.newCourse._id}`}>
              Course
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Link
              href={`/courses/edit/lessons/${reduxState.courses.newCourse._id}`}
            >
              Lessons
            </Link>
          </BreadcrumbItem>
          <BreadcrumbItem active>Modules</BreadcrumbItem>
        </Breadcrumb>
      </Container>
      <Row>
        <Col md="3">
          <Card>
            <CardHeader className="d-flex justify-content-between bg-secondary">
              <Button
                className="btn-icon btn-2"
                color="primary"
                outline
                type="button"
                size="sm"
                onClick={() => setToggleModule(!toggleModule)}
              >
                <span className="btn-inner--icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span className="btn-inner--text">Create Module</span>
              </Button>
            </CardHeader>
            <CardBody>
              <GenerateModuleLists
                modulesList={modulesList.sub}
                focusModule={focusModule}
                setFocusModule={setFocusModule}
                modulesList={modulesList}
                setModuleList={setModuleList}
                parentModuleId={parentModuleId}
              />
            </CardBody>
          </Card>
        </Col>
        <Col md="7">
          {!focusModule.details && (
            <>
              <CertificateCreator
                focusModule={focusModule}
                setFocusModule={setFocusModule}
              />
              <Input
                className="my-2 input-group-alternative"
                value={focusModule.name}
                type="text"
                placeholder="name"
                name="name"
                onChange={handlefocusModuleChange}
              />
              <Input
                className="my-2 input-group-alternative"
                value={focusModule.description}
                type="textarea"
                placeholder="description"
                name="description"
                rows="6"
                onChange={handlefocusModuleChange}
              />

              <h3 className="mt-3">Resources</h3>
              <ModuleResources
                resourcesList={focusModule.resources}
                setFocusModule={setFocusModule}
                focusModule={focusModule}
                setModuleList={setModuleList}
                modulesList={modulesList}
              />
            </>
          )}
          {focusModule.details && focusModule.type !== "Quiz" && (
            <MarkDownEditor
              value={focusModule.details.content}
              setValue={handleMarkDownChange}
            />
          )}
          {focusModule.details && focusModule.type === "Quiz" && (
            <div className="my-5">
              <QuizPreviewComponent
                quizList={quizQuestionCollections}
                Editquiz={Editquiz}
                DeleteQuiz={DeleteQuiz}
              />
              <div>
                <QuizCreateComponent
                  selectedQuiz={selectedQuiz}
                  setSelectedQuiz={setSelectedQuiz}
                  quizQuestionCollections={quizQuestionCollections}
                  setQuizQuestionCollections={setQuizQuestionCollections}
                  focusModule={focusModule}
                />
              </div>
            </div>
          )}
        </Col>
        <Col md="2">
          <h4>Created On</h4>
          <span className="text-center h5 text-gray">
            {courseData.createdAt
              ? moment(courseData.createdAt).format("LLLL")
              : "--"}
          </span>
          <h4>Published On</h4>
          <span className="text-center h5 text-gray">
            {courseData.publishedAt
              ? moment(courseData.publishedAt).format("LLLL")
              : "--"}
          </span>
          <h4>Last updated</h4>
          <span className="text-center h5 text-gray">
            {courseData.updatedAt
              ? moment(courseData.updatedAt).format("LLLL")
              : "--"}
          </span>
          <Button className="mt-3" block outline onClick={changeArchiveStatus}>
            {courseData.isArchived ? (
              <>
                Remove from Archive <i className="ml-1 far fa-ban" />
              </>
            ) : (
              <>
                Archive Course <i className="ml-1 fas fa-archive" />
              </>
            )}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default EditorPage;
