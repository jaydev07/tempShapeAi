import React from "react";
import { Collapse } from "reactstrap";
import classnames from "classnames";

import ResourceComp from "./ResourceComp";

const ResourceNested = ({ modules }) => {
  const [toggle, setToggle] = React.useState(false);

  const nestedModules = (modules.subs || []).map((module) => {
    return <ResourceNested key={modules._id} modules={module} />;
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
      <Collapse isOpen={toggle}>
        <>
          {modules.resources.length &&
            modules.resources.map((resource) => <ResourceComp {...resource} />)}
          {nestedModules}
        </>
      </Collapse>
    </div>
  );
};

export default ResourceNested;
