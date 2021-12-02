import React from "react";
import Router from "next/router";

// Layout
import AuthLayout from "../../layouts/Auth";

const RedirectToAuth = () => {
  React.useEffect(() => {
    Router.push("/auth/login");
  });
  return <div />;
};

RedirectToAuth.layout = AuthLayout;

export default RedirectToAuth;
