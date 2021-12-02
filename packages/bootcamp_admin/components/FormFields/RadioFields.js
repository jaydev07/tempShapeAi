import React from "react";

const RadioBox = ({ children, htmllabel, ...props }) => {
  return (
    <div className=" custom-control custom-radio mb-3">
      <input className=" custom-control-input" type="radio" {...props}></input>
      <label className=" custom-control-label" htmlFor={htmllabel}>
        {children}
      </label>
    </div>
  );
};

export default RadioBox;
