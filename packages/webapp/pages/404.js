import React from "react";

// layout for this page
import Admin from "layouts/Admin.js";

const Error404 = () => {
  return (
    <div className="d-flex justify-content-center align-item-center align-content-center">
      <h1>404 | Page Not Found or Under Development</h1>
    </div>
  );
};

Error404.layout = Admin;

export default Error404;
