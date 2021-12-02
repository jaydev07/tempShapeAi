import React from "react";
import Router from "next/router";

const RedirectToDashboard = () => {
  React.useEffect(() => {
    Router.push("/student/dashboard");
  });
  return <div />;
};

export default RedirectToDashboard;
