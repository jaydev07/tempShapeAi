/*!

=========================================================
* NextJS Argon Dashboard PRO - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { withRouter } from "next/router";
// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes from "routes.js";

function Auth({ children }) {
  React.useEffect(() => {
    document.body.classList.add("auth-bg");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.remove("auth-bg");
    };
  });
  return (
    <>
      <div className="main-content">
        {children}
      </div>
    </>
  );
}

export default withRouter(Auth);
