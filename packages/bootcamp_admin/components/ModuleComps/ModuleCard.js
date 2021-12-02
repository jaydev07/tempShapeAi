import React, { useCallback, useRef, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Badge,
  Form,
  Button,
  Modal,
  ModalBody,
  Input,
} from "reactstrap";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import ContentEditable from "react-contenteditable";
import { toast } from "react-toastify";

// Utils
import { debounce } from "../../utils/CreateCourse";

// Redux Action
import {
  updateModuleDetailsAction,
  deleteModuleAction,
} from "../../redux/reducers/courses/courses.action";

const ModuleCard = ({ _id, name, description, isProjectModule, ...rest }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const nameRef = useRef(null);
  const descriptionRef = useRef(null);

  const reduxState = useSelector(({ error }) => ({ error }));

  useEffect(() => {
    if (reduxState.error.error) {
      toast.error(reduxState.error.error);
    }
  }, [reduxState.error]);

  const debounceModuleEditData = useCallback(
    debounce((modifiedObj) => {
      return saveModuleEdits(1, modifiedObj);
    }, 2000),
    []
  );

  const handleModuleChange = ({ value, name }) => {
    return debounceModuleEditData({
      name,
      value,
    });
  };

  const redirect = (e) =>
    router.push(`/courses/edit/modules/${_id}`);

  const saveModuleEdits = async (e, modifiedObj) =>
    await dispatch(
      updateModuleDetailsAction({
        id: _id,
        [modifiedObj.name]: modifiedObj.value,
      })
    );

  const deleteModule = async () => {
    const { payload } = await dispatch(deleteModuleAction(_id));
    if (payload) {
      rest.setModulesData(
        rest.modulesData.filter((module) => module._id !== payload)
      );
      toast.success("Lesson deleted");
    }
  };

  const colors = ["primary", "success", "danger", "warning", "default"];
  let count = Math.floor(Math.random() * colors.length);
  return (
    <>
      <Card
        key={_id}
        className={`border-${colors[count]}-5-left my-4 shadow-2lg`}
      >
        <CardBody>
          <div className="d-flex justify-content-end">
            <Button
              className="btn-icon btn-2"
              color="danger"
              type="button"
              size="sm"
              onClick={deleteModule}
            >
              <span className="btn-inner--icon">
                <i className="fas fa-trash-alt"></i>
              </span>
            </Button>
          </div>
          {isProjectModule && (
            <Badge
              className={`my-2 bg-gradient-${colors[count]} text-white text-capitalize`}
            >
              Project Based Module
            </Badge>
          )}
          {rest.isOptionModule && (
            <Badge
              className={`my-2 bg-gradient-${colors[count]} text-white text-capitalize`}
            >
              Project Based Lesson
            </Badge>
          )}
          <ContentEditable
            innerRef={nameRef}
            className="font-weight-700"
            onChange={(e) => handleModuleChange({ name: "name", ...e.target })}
            html={name}
            tagName="h2"
          />
          <ContentEditable
            innerRef={descriptionRef}
            className="description text-muted font-weight-bold"
            onChange={(e) =>
              handleModuleChange({ name: "description", ...e.target })
            }
            html={description || "No description available"}
            tagName="p"
          />
          <Button
            color="primary"
            className="float-right"
            outline
            onClick={redirect}
            id={_id}
          >
            Add / Edit Modules <i className="fas fa-arrow-right ml-2" />
          </Button>
        </CardBody>
      </Card>
    </>
  );
};

export default ModuleCard;
