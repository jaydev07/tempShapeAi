import { Modal, ModalBody, Input, Button, Col, Label, Alert } from "reactstrap";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";

// Redux Actions
import {
  createNewModuleAction,
  createNewTask,
} from "../../redux/reducers/courses/courses.action";

// Utils
import { processModules } from "../../utils/CreateCourse/";

const CreateModuleModal = ({
  toggleModal,
  setToggleModal,
  modulesList,
  setModuleList,
  ...props
}) => {
  const [points, setPoints] = useState({ DocumentTask: 5, Quiz: 5 });
  const [contentName, setContentName] = useState("");

  const dispatch = useDispatch();
  const reduxState = useSelector(({ courses }) => ({ courses }));

  const toggle = () => setToggleModal(!toggleModal);

  const createModule = async (type) => {
    const doesOptionModuleExist = modulesList.sub.filter(
      ({ isOptionModule, parentModule }) =>
        isOptionModule && parentModule === props._id
    );

    if (doesOptionModuleExist.length)
      return alert("Only one option module is allowed for now.");

    let data = {
      name: contentName,
      description: "",
      course: reduxState.courses.newCourse._id,
      isSub: true,
      parentModule: props._id,
      isProjectModule: type === "ProjectModule",
      isOptionModule: type === "OptionModule",
      isCertificateAvailable: false,
      certificateTemplate: null,
    };

    const { payload: moduleData } = await dispatch(createNewModuleAction(data));

    setContentName("");

    const rawModules = [...modulesList.raw, { ...moduleData }];

    toggle();
    return setModuleList({
      ...modulesList,
      ...processModules([...modulesList.sub, moduleData]),
      raw: rawModules,
    });
  };

  const createNewUnit = async (e, type) => {
    const data = {
      name: contentName,
      description: "",
      details: { content: "" },
      course: reduxState.courses.newCourse._id,
      module: props._id,
      type,
      points: points[type],
    };
    setPoints({ ...points, [type]: 0 });

    const { payload } = await dispatch(createNewTask(data));

    const updateUnit = modulesList.sub.map((module) => {
      if (module._id === props._id) {
        return {
          ...module,
          units: [
            ...module.units,
            {
              type: "",
              unit: {
                ...payload,
                id: payload._id,
              },
            },
          ],
        };
      }
      return module;
    });

    setContentName("");
    toggle();

    return setModuleList({
      ...modulesList,
      ...processModules(updateUnit),
      raw: updateUnit,
    });
  };

  return (
    <Modal isOpen={toggleModal} toggle={toggle}>
      <ModalBody>
        <Alert
          color="danger"
          isOpen={
            modulesList.parentMod &&
            modulesList.parentMod.isPublished === "true"
          }
        >
          <span className="alert-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </span>
          <span className="alert-text">
            This is a <strong>published module</strong>, hence you cannot create
            new units or add new modules. Although you can edit the existing
            modules and units.
          </span>
        </Alert>
        <div
          className={classnames({
            "disabled-contents":
              modulesList.parentMod &&
              modulesList.parentMod.isPublished === "true",
          })}
        >
          <Label htmlFor="nameOftheContent">Content name</Label>
          <Input
            id="nameOftheContent"
            name="nameOftheContent"
            type="text"
            placeholder="Enter name"
            onChange={(e) => setContentName(e.target.value)}
            value={contentName}
          />{" "}
          <hr />
          <h4 className="mt--4 text-center">
            Choose you how want to create your content
          </h4>
          <br />
          {props.focusModule.moduleLevel <= 2 && (
            <>
              <Button
                color="primary"
                outline
                className="my-2"
                href="#pablo"
                onClick={
                  props.isProjectModule
                    ? () => createModule("OptionModule")
                    : () => createModule()
                }
                disabled={
                  modulesList.parentMod &&
                  modulesList.parentMod.isPublished === "true"
                }
              >
                <i className="fas fa-plus " />{" "}
                {props.isProjectModule
                  ? "Create Option Module"
                  : "Create Module"}
              </Button>
              {props.disableProjectModule ||
              props.isProjectModule ||
              props.isOptionModule ? null : (
                <Button
                  href="#pablo"
                  color="primary"
                  outline
                  onClick={() => createModule("ProjectModule")}
                  className="my-2"
                  disabled={
                    modulesList.parentMod &&
                    modulesList.parentMod.isPublished === "true"
                  }
                >
                  <i className="fab fa-product-hunt " /> Create Project Module
                </Button>
              )}
            </>
          )}
          <br />
          {!props.isParent && !props.disableUnits && (
            <>
              <div className="d-flex align-items-end mt-2">
                <Col md="6">
                  <Label htmlFor="documentTaskPoints">Points</Label>
                  <Input
                    id="documentTaskPoints"
                    name="documentTaskPoints"
                    type="number"
                    placeholder="add points"
                    onChange={(e) =>
                      setPoints({
                        ...points,
                        DocumentTask: e.target.valueAsNumber,
                      })
                    }
                    value={points.DocumentTask}
                    bsSize="sm"
                  />
                </Col>
                <Col md="6" md="6">
                  <Button
                    onClick={(e) => {
                      createNewUnit(e, "DocumentTask");
                      setPoints({ ...points, DocumentTask: 0 });
                      return toggle();
                    }}
                    id={props._id}
                    size="sm"
                    disabled={
                      props.parentModule &&
                      modulesList.parentMod &&
                      modulesList.parentMod.isPublished === "true"
                    }
                  >
                    Create DocumentTask
                  </Button>
                </Col>
              </div>
              <div className="d-flex align-items-end mt-2 ">
                <Col md="6">
                  <Label htmlFor="quizTaskPoints">Points</Label>
                  <Input
                    type="number"
                    id="quizTaskPoints"
                    name="quizTaskPoints"
                    placeholder="add points"
                    onChange={(e) =>
                      setPoints({ ...points, Quiz: e.target.valueAsNumber })
                    }
                    value={points.Quiz}
                    bsSize="sm"
                  />
                </Col>
                <Col md="6">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      createNewUnit(e, "Quiz", props._id, points.quiz);
                      setPoints({ ...points, Quiz: 0 });
                      return toggle();
                    }}
                    id={props._id}
                    disabled={
                      props.parentModule &&
                      modulesList.parentMod &&
                      modulesList.parentMod.isPublished === "true"
                    }
                  >
                    Create Quiz
                  </Button>
                </Col>
              </div>
            </>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
};

export default CreateModuleModal;
