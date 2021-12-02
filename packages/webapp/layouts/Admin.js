import React from "react";
import { withRouter } from "next/router";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import { store } from '../Redux/store';
import routes from "routes.js";

function Admin({ router, children }) {
  const [sidenavOpen, setSidenavOpen] = React.useState(true);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/student") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (router.pathname.indexOf(routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  const checkIfFormFilledAndRedirect = () => {
    const state = store.getState();
    if (!state.userReducer.user.isVerified) router.push('/auth/pending-verification');
    if (!state.userReducer.status.hasSubmittedInitForm) router.push('/student/form');
  }
  React.useEffect(() => {
  checkIfFormFilledAndRedirect()
  }, []);
  
  // toggles collapse between mini sidenav and normal
  const toggleSidenav = (e) => {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
    }
    setSidenavOpen(!sidenavOpen);
  };

  return (
    <>
      <Sidebar
        routes={routes}
        toggleSidenav={toggleSidenav}
        sidenavOpen={sidenavOpen}
        logo={{
          innerLink: "/",
          imgSrc: require("assets/img/brand/SHAPEAI_logo.webp"),
          imgAlt: "...",
        }}
      />
      <div className="main-content">
        <AdminNavbar
          toggleSidenav={toggleSidenav}
          sidenavOpen={sidenavOpen}
          brandText={getBrandText(router.pathname)}
        />
        {children}
      </div>
      {sidenavOpen ? (
        <div className="backdrop d-xl-none" onClick={toggleSidenav} />
      ) : null}
    </>
  );
}

export default withRouter(Admin);
