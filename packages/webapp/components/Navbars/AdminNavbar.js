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
import Link from "next/link";
// nodejs library that concatenates classes
import classnames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// reactstrap components
import {
  Collapse,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Badge,
} from "reactstrap";
import { useSelector } from "react-redux";

function AdminNavbar({ theme, sidenavOpen, toggleSidenav, ...props }) {
  const reduxStore = useSelector(({ userReducer }) => ({ userReducer }));

  return (
    <>
      <Navbar
        className={classnames(
          "navbar-top sticky-top navbar-expand border-bottom",
          { "navbar-dark bg-dark": props.learnPage },
          { "navbar-light bg-secondary": theme === "light" }
        )}
      >
        <Container fluid>
          <Collapse navbar isOpen={true}>
            <Nav className="mr-sm-3" navbar>
              <NavItem className="d-none d-md-block d-md-flex align-items-center">
                {!props.learnPage && (
                  <Link href="/student/">
                    <img
                      className="pointer"
                      src={require("../../assets/img/brand/SHAPEAI_logo.webp")}
                      alt="logo"
                    />
                  </Link>
                )}
                {props.learnPage && (
                  <Button
                    className="btn-icon btn-3 ml-2"
                    outline
                    size="sm"
                    type="button"
                  >
                    <span className="btn-inner--icon">
                      <i
                        className={classnames({
                          "fas fa-bars": !props.showcontent,
                          "fas fa-times": props.showcontent,
                        })}
                      ></i>
                    </span>
                    <span
                      className="btn-inner--text"
                      onClick={props.showSidebar}
                    >
                      {props.showcontent ? "Close Sidebar" : "Open Sidebar"}
                    </span>
                  </Button>
                )}
              </NavItem>
            </Nav>
            <Nav className="align-items-center ml-lg-auto" navbar>
              {!props.learnPage && (
                <NavItem className="d-xl-none">
                  <div
                    className={classnames(
                      "pr-3 sidenav-toggler",
                      { active: sidenavOpen },
                      { "sidenav-toggler-dark": theme === "dark" }
                    )}
                    onClick={toggleSidenav}
                  >
                    <div className="sidenav-toggler-inner">
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                    </div>
                  </div>
                </NavItem>
              )}{" "}
              {props.learnPage && (
                <Button
                  className="btn-icon btn-3 ml-2 d-md-none"
                  outline
                  size="sm"
                  type="button"
                >
                  <span className="btn-inner--icon">
                    <i
                      className={classnames({
                        "fas fa-bars": !props.showcontent,
                        "fas fa-times": props.showcontent,
                      })}
                    ></i>
                  </span>
                  <span className="btn-inner--text" onClick={props.showSidebar}>
                    {props.showcontent ? "Close Sidebar" : "Open Sidebar"}
                  </span>
                </Button>
              )}
            </Nav>

            <Nav className="align-items-center ml-md-auto" navbar>
              {!props.learnPage && (
                <NavItem className="d-md-none">
                  <Link href="/student/">
                    <img
                      className="pointer"
                      src={require("../../assets/img/brand/SHAPEAI_logo.webp")}
                      alt="logo"
                    />
                  </Link>
                </NavItem>
              )}
            </Nav>

            <Nav className="align-items-center ml-auto pointer" navbar>
              <div className="d-flex justify-content-center align-items-center">
                <h4 className="bg-primary rounded p-1 text-white font-weight-700">
                  XP
                </h4>
                <h1
                  className={classnames("display-3 ml-2 font-weight-800", {
                    "text-white": props.learnPage,
                  })}
                >
                  {reduxStore.userReducer.user.xp || 0}
                </h1>
              </div>
            </Nav>

            <Nav className="align-items-center ml-auto pointer" navbar>
              {!props.learnPage && (
                <NavItem className="pointer">
                  <Link href="/student/profile">
                    <img
                      className="pointer"
                      src={
                        reduxStore.userReducer.user.profilePicture.location &&
                        reduxStore.userReducer.user.profilePicture.location
                      }
                      alt="user avatar"
                      className="shadow border border-primary profile-img-custom-navbar"
                    />
                  </Link>
                </NavItem>
              )}
              {props.learnPage && !props.isQuiz && !props.alreadyComplete && (
                <Button
                  className="btn-icon btn-3"
                  color="primary"
                  type="button"
                  onClick={props.handleNext}
                >
                  <span className="btn-inner--text">Next</span>
                  <span className="btn-inner--icon">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </Button>
              )}
              {props.learnPage && props.alreadyComplete && (
                <h4 className="text-white">
                  <i className="fas fa-check-circle" /> Module Completed
                </h4>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

AdminNavbar.defaultProps = {
  toggleSidenav: () => {},
  sidenavOpen: false,
  theme: "light",
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(["dark", "light"]),
};

export default AdminNavbar;
