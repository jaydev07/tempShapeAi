import React from "react";
import { FormGroup, Input, Label } from "reactstrap";

const CheckBox = ({ children, ...props }) => {
  return (
    <FormGroup check>
      <Label className="checkbox-input" htmlFor={props.for}>
        <Input type={props.type || "checkbox"} {...props}  />
        {children}
      </Label>
    </FormGroup>
  );
};

export default CheckBox;
