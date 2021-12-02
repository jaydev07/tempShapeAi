import React, { Component } from "react";
import Router from "next/router";

export default function Logout() {
  React.useEffect(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("persist:shapeAI");
    Router.push("/auth/login");
  });
  return <div />;
}
