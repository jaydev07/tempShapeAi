import React from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";

import { getTaskAction } from "../../Redux/reducer/bootcamp/bootcamp.action";

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
  const reduxState = useSelector(({ bootcampReducer }) => ({
    bootcampReducer,
  }));

  React.useEffect(() => {
    const checkUnit = async () => {
      if (props.isCurrentTask) {
        const { payload } = await dispatch(getTaskAction(_id));
        setFocusModule({
          ...payload,
        });
      }
    };
    checkUnit();
  }, []);

  const toggleUnits = (e) => {
    reduxState.bootcampReducer.modules.map((module) => {
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

  return (
    <>
      <div className="my-1 d-flex justify-content-between align-items-center">
        <div>
          <i
            className={classnames("far fa-file-alt mr-2", {
              "text-primary": focusModule._id === _id,
              "text-success": !props.isCurrentTask && props.isCompleted,
            })}
            id={_id}
            onClick={
              !props.isCompleted ? () => alert("Unit is locked") : toggleUnits
            }
          />
          <i
            className={classnames("font-weight-400 pointer", {
              "text-primary font-weight-600": focusModule._id === _id,
            })}
            id={_id}
            onClick={!props.isCompleted ? () => alert("This unit is locked!") : toggleUnits}
          >
            {name}
          </i>
        </div>
        <i
          className={classnames({
            "fas fa-lock fa-xs text-default":
              !props.isCurrentTask && !props.isCompleted,
            "far fa-circle fa-sm text-info":
              props.isCurrentTask && !props.isCompleted,
            "fas fa-check-circle fa-sm text-success":
              !props.isCurrentTask && props.isCompleted,
          })}
        />
      </div>
    </>
  );
};

export default UnitComp;
