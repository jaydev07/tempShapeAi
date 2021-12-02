import React from "react";
import { Collapse } from "reactstrap";
import classnames from "classnames";

import UnitComp from "./UnitComp";

const ModuleList = ({ modules, focusModule, setFocusModule, unitstrack }) => {
  const [toggle, setToggle] = React.useState(unitstrack.includes(modules._id));

  const nestedModules = (modules.subs || []).map((module) => {
    return (
      <ModuleList
        key={modules._id}
        modules={module}
        focusModule={focusModule}
        setFocusModule={setFocusModule}
        unitstrack={unitstrack}
      />
    );
  });

  return (
    <div>
      <div className="my-1 d-flex justify-content-between align-items-center pointer">
        <i
          className="font-weight-400 pointer"
          onClick={() => setToggle(!toggle)}
        >
          {modules.name}
        </i>
        <i
          className={classnames({
            "fas fa-caret-right fa-lg": !toggle,
            "fas fa-caret-down fa-lg": toggle,
          })}
          onClick={() => setToggle(!toggle)}
        />
      </div>
      <Collapse isOpen={toggle || unitstrack.includes(modules._id)}>
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
