import React from "react";
import { Collapse } from "reactstrap";
import classnames from "classnames";

const SideBarDropdown = ({ name, children, defaultOpen, ...props }) => {
  const [toggle, setToggle] = React.useState(false);

  React.useEffect(() => {
    if (defaultOpen) setToggle(true);
  }, []);

  const colors = ["primary", "success", "danger", "warning", "default"];
  let count = Math.floor(Math.random() * colors.length);

  return (
    <div
      className={classnames(
        `my-2 mx-1 rounded sidebar__collapse__content py-1 px-2 pointer bg-secondary border-${colors[count]}-5-left`,
        {
          shadow: toggle,
        }
      )}
    >
      <div className="d-flex justify-content-between align-items-center ">
        <h3 onClick={() => setToggle(!toggle)}>{name}</h3>
        <i
          className={classnames({
            "fas fa-chevron-down": !toggle,
            "fas fa-chevron-up": toggle,
          })}
          onClick={() => setToggle(!toggle)}
        />
      </div>

      <Collapse isOpen={toggle} className="p-3 bg-secondary">
        {children}
      </Collapse>
    </div>
  );
};

export default SideBarDropdown;
