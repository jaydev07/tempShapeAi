import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Collapse,
  NavItem,
  NavLink,
  Nav,
  NavbarToggler,
  NavbarBrand,
  Button,
  Navbar,
  Badge,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import NewCourseModal from "../Modals/CreateNewCourse.modal";

import { publishCourseAction } from "../../redux/reducers/courses/courses.action";

import { processModules } from "../../utils/CreateCourse/index";

function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const reduxState = useSelector(({ courses }) => ({ courses }));

  const router = useRouter();
  const dispatch = useDispatch();

  const toggle = () => setIsOpen(!isOpen);

  const publishCourse = async () => {
    let isEmpty = false;
    let modifiedModules = {
      parent: [],
      sub: [],
    };
    const modules = processModules(reduxState.courses.modules);

    for (let i = 0; i < modules.parent.length; i++) {
      const subModsss = modules.sub.filter(
        ({ parentModule }) => parentModule === modules.parent[i]._id
      );

      modifiedModules.parent.push({ ...modules.parent[i], subs: subModsss });
    }

    modifiedModules.parent.map((module) => {
      if (!module.subs.length) {
        isEmpty = true;
        return;
      }
    });

    reduxState.courses.modules.map(({ isSub, units, ...rst }) => {
      if (isSub && !units.length) {
        isEmpty = true;
        return;
      }
    });

    if (isEmpty) return alert("one or more modules are empty");

    const { payload } = await dispatch(
      publishCourseAction(reduxState.courses.newCourse._id)
    );

    if (payload.name) {
      router.push(`/courses/published`);
    }
  };

  return (
    <>
      <NewCourseModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <Navbar className="bg-transparent shadow" light expand="md">
        <NavbarBrand href="/">
          <img src={require("../../assets/img/brand/SHAPEAI_logo.webp")} />
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink href="/courses/">All Courses</NavLink>
            </NavItem>
          </Nav>
          <Nav className="ml-auto">
            <NavItem>
              {router.pathname.includes("/edit") ? (
                <>
                  <Button color="primary" className="bg-gradient-primary" onClick={publishCourse}>
                    Publish Course <i className="fas fa-paper-plane" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="primary"
                    onClick={() => setModalOpen(!modalOpen)}
                  >
                    Create New Course <i className="fas fa-plus" />
                  </Button>
                </>
              )}
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
