import React from "react";
import classnames from "classnames";
import {
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
} from "reactstrap";
import { useField } from "formik";

const InputFields = ({ label, ...props }) => {
  // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
  // which we can spread on <input>. We can use field meta to show an error
  // message if the field is invalid and it has been touched (i.e. visited)
  const [field, meta] = useField(props);
  return (
    <>
      <Label htmlFor={props.id || props.name}>{label}</Label>
      <InputGroup
        className={classnames("mb-3", {
          "input-group-alternative": props.alt,
        })}
      >
        {props.icon ? (
          <>
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className={`fas fa-${props.icon}`} />
              </InputGroupText>
            </InputGroupAddon>
          </>
        ) : (
          <></>
        )}
        <Input
          className={classnames({
            "is-invalid": props.error,
            "form-control-alternative": props.alt,
          })}
          {...field}
          {...props}
        />
      </InputGroup>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export default InputFields;
