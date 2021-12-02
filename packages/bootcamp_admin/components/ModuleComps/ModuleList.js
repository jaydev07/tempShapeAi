import React from "react";
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import { useSelector, useDispatch } from "react-redux";

import UnitComp from "./UnitComp";
import CreateModuleModal from "./CreateModuleModal";

import { deleteModuleAction } from "../../redux/reducers/courses/courses.action";

const ModuleList = ({
  modules,
  focusModule,
  setFocusModule,
  modulesList,
  setModuleList,
  parentModuleId,
}) => {
  const [toggle, setToggle] = React.useState(false);
  const [toggleModal, setToggleModal] = React.useState(false);

  const dispatch = useDispatch();
  const reduxState = useSelector(({ courses }) => ({
    courses,
  }));

  const toggleModule = () => {
    if (focusModule._id === modules._id) return setToggle(!toggle);

    reduxState.courses.modules.map(
      (allModule) =>
        allModule._id === modules._id &&
        setFocusModule({ ...allModule, moduleLevel: modules.level })
    );

    return setToggle(!toggle);
  };

  const nestedModules = (modules.subs || []).map((module) => {
    return (
      <ModuleList
        key={modules._id}
        modules={module}
        focusModule={focusModule}
        setFocusModule={setFocusModule}
        modulesList={modulesList}
        setModuleList={setModuleList}
        parentModuleId={parentModuleId}
      />
    );
  });

  const deleteModule = async () => {
    await dispatch(deleteModuleAction(modules._id));
  };
  console.log({ mmmm: modules.level });
  return (
    <div>
      <CreateModuleModal
        toggleModal={toggleModal}
        setToggleModal={setToggleModal}
        {...modules}
        modulesList={modulesList}
        setModuleList={setModuleList}
        parentModuleId={parentModuleId}
        focusModule={focusModule}
        moduleLevel={modules.level}
      />
      <div className=" my-2 d-flex justify-content-between align-items-center pointer">
        <div>
          <i
            className={classnames({
              "fas fa-folder": !toggle,
              "fas fa-folder-open": toggle,
            })}
            onClick={toggleModule}
          />
          <i className="font-weight-400 pointer ml-2" onClick={toggleModule}>
            {modules.name}
          </i>
        </div>
        <UncontrolledDropdown>
          <DropdownToggle
            className="btn-icon btn-2"
            color="primary"
            outline
            size="sm"
            type="button"
            id="moduleListActionOptions"
            onClick={toggleModule}
          >
            <span className="btn-inner--icon">
              <i class="fas fa-ellipsis-v" />
            </span>
          </DropdownToggle>

          <DropdownMenu aria-labelledby="moduleListActionOptions">
            <DropdownItem
              href="#pablo"
              onClick={(e) => setToggleModal(!toggleModal)}
            >
              <i className="fas fa-plus text-primary" /> Add Content Inside
            </DropdownItem>
            <DropdownItem href="#pablo" onClick={deleteModule}>
              <i className="fas fa-trash-alt text-danger" /> Delete Module
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
      <Collapse isOpen={toggle}>
        <>
          {modules.units.length &&
            modules.units.map(
              ({ unit, type }) =>
                unit &&
                unit._id &&
                type !== "Module" && (
                  <UnitComp
                    moduleId={modules._id}
                    focusModule={focusModule}
                    setFocusModule={setFocusModule}
                    key={unit._id}
                    {...unit}
                  />
                )
            )}
          {nestedModules}
        </>
      </Collapse>
    </div>
  );
};

export default ModuleList;
