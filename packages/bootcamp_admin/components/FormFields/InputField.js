import React from "react";
import classnames from "classnames";
import {
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from "reactstrap";

export default function InputField(props) {
  return (
    <div>
      <FormGroup
        className={classnames({
          "has-danger": props.error,
        })}
      >
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
            placeholder={props.placeholder}
            type={props.type}
            name={props.name}
            onChange={props.onChange}
            required={props.required}
            onFocus={props.onFocus}
            value={props.value}
            readOnly={props.readOnly}
            size={props.size}
            onBlur={props.onBlur}
          />
        </InputGroup>
      </FormGroup>
      <div
        className={classnames({
          "text-danger font-italic mt--3 mb-3": props.error,
          "text-hide": !props.error,
        })}
      >
        <small>{props.error}</small>
      </div>
    </div>
  );
}
