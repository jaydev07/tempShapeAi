import React from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import { Button } from "reactstrap";

import {
  getTaskAction,
  deleteUnitAction,
} from "../../redux/reducers/courses/courses.action";

const UnitComp = ({
  name,
  type,
  moduleId,
  setFocusModule,
  focusModule,
  _id,
  ...props
}) => {
  const dispatch = useDispatch();
  const reduxState = useSelector(({ courses }) => ({
    courses,
  }));

  const toggleUnits = (e) => {
    reduxState.courses.modules.map((module) => {
      if (module._id === moduleId) {
        module.units.map(async ({ unit }) => {
          if (unit && unit._id === _id) {
            const { payload } = await dispatch(getTaskAction(_id));
            setFocusModule({ ...unit, ...payload });
          }
        });
        return module;
      }
      return module;
    });
  };

  const deleteUnit = async () => {
    await dispatch(deleteUnitAction(_id, moduleId));
  };

  return (
    <>
      <div className="my-2 d-flex justify-content-between align-items-center">
        <div>
          <i
            className={classnames({
              "far fa-file-alt mr-2": type.includes("Doc"),
              "fas fa-list-ul mr-2": type.includes("Quiz"),
            })}
            id={_id}
            onClick={toggleUnits}
          />
          <i
            className={classnames("font-weight-400 pointer", {
              "text-primary font-weight-600": focusModule._id === _id,
            })}
            id={_id}
            onClick={toggleUnits}
          >
            {name}
          </i>
        </div>
        <div>
          <Button
            className="btn-icon btn-2"
            color="danger"
            outline
            type="button"
            size="sm"
            onClick={deleteUnit}
          >
            <span className="btn-inner--icon">
              <i className="fas fa-trash-alt"></i>
            </span>
          </Button>
        </div>
      </div>
    </>
  );
};

export default UnitComp;
