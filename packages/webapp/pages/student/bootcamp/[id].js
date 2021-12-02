import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Spinner,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";

import TimeLineWrapper from "../../../components/VerticalTimeLine/VerticalTimeLineWrapper";
import TimeLineItem from "../../../components/VerticalTimeLine/VerticalTimeLineItem";

// layout for this page
import Admin from "layouts/Admin.js";

// Utilities
import { processModules } from "../../../utils/bootcamp";

// Redux Action
import {
  getSingleBootCampAction,
  getAllModulesAction,
  enrollCourseAction,
} from "../../../Redux/reducer/bootcamp/bootcamp.action";

const Test = () => {
  const [alert, setalert] = React.useState(false);
  const [listingInfo, setListingInfo] = useState({ lessons: 0, resources: 0 });
  const [courseData, setCourseData] = useState({ image: { location: "" } });
  const [modulesList, setModulesList] = useState({ parent: [], sub: [] });
  const [isCourseEnrolled, setIsCourseEnrolled] = useState("");
  const [
    isAlreadyEnrolledInOtherCourse,
    setIsAlreadyEnrolledInOtherCourse,
  ] = useState(false);

  const reduxState = useSelector(({ bootcampReducer, userReducer }) => ({
    bootcampReducer,
    userReducer,
  }));

  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;

  useEffect(async () => {
    if (id) {
      const { payload } = await dispatch(getSingleBootCampAction(id));
      setCourseData(payload);
      if (payload._id) {
        if (reduxState.userReducer.user.enrolledCourseId === payload.Id)
          setIsCourseEnrolled("Course Enrolled");

        const modules = await dispatch(getAllModulesAction(payload._id));
        if (modules) {
          setListingInfo(
            modules.payload
              .map(({ resources, units }) => ({
                resources: resources.length,
                lessons: units.length,
              }))
              .reduce((prevValue, currValue) => ({
                resources: prevValue.resources + currValue.resources,
                lessons: prevValue.lessons + currValue.lessons,
              }))
          );
          setModulesList(processModules(modules.payload));
        }
      }
    }
  }, [id]);

  const handleEnroll = async (e) => {
    e.preventDefault();

    setIsAlreadyEnrolledInOtherCourse(false);

    const { payload } = await dispatch(
      enrollCourseAction(courseData._id, courseData.Id)
    );

    if (!payload.message) {
      return setIsCourseEnrolled(payload);
    }
  };

  const validateEnroll = (e) => {
    if (reduxState.userReducer.user.enrolledCourseId) {
      return setIsAlreadyEnrolledInOtherCourse(true);
    }

    return handleEnroll(e);
  };

  const redirect = () =>
    router.push(`/student/bootcamp/learn/${courseData._id}/`);

  const basicAlert = (projectTitle, projectDesc) => {
    setalert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title={projectTitle}
        onConfirm={() => setalert(null)}
        onCancel={() => setalert(null)}
        btnSize=""
      >
        <p className="description text-muted font-weight-600">{projectDesc}</p>
      </SweetAlert>
    );
  };
  return (
    <>
      <Head>
        <title>Student - Profile</title>
      </Head>
      {alert}
      <Modal
        isOpen={isAlreadyEnrolledInOtherCourse}
        toggle={() =>
          setIsAlreadyEnrolledInOtherCourse(!isAlreadyEnrolledInOtherCourse)
        }
      >
        <ModalBody className="d-flex justify-content-center flex-column">
          <h3>
            You're already enrolled in course, enrolling in this course will
            cancel your enrollment in the previous course. <br />
            <span className="font-weight-700"> Do you want to Continue?</span>
          </h3>
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            type="button"
            onClick={() =>
              setIsAlreadyEnrolledInOtherCourse(!isAlreadyEnrolledInOtherCourse)
            }
          >
            Close
          </Button>
          <Button color="warning" type="button" onClick={handleEnroll}>
            Continue
          </Button>
        </ModalFooter>
      </Modal>
      <Container className="mt-4 relative" fluid>
        <div className="d-md-flex flex-row-reverse">
          <Col md="5" lg="5">
            <img
              src={
                courseData.image
                  ? courseData.image.location
                  : "https://image.freepik.com/free-vector/abstract-wallpaper_23-2148663179.jpg"
              }
              alt="course thumnail"
              className="img-fluid rounded shadow-2lg"
            />
          </Col>
          <Col md="7" lg="7">
            <h1 className="display-2 font-weight-700">{courseData.name}</h1>
            <p className=" font-weight-500">{courseData.description}</p>
          </Col>
        </div>
        <Card className="shadow-2lg bg-gradient-info my-5">
          <CardBody>
            <Row className="d-flex justify-content-around text-white">
              <Col md="3" className=" border-left my-2">
                <h3 className=" text-white ">Estimated Time</h3>
                <h2 className=" text-white">3 Months</h2>
                <h5 className=" text-white">At 10 hrs/week</h5>
              </Col>
              <Col md="3" className="border-left my-2">
                <h3 className=" text-white">Next batch</h3>
                <h2 className=" text-white">April 10, 2021</h2>
                <h5 className=" text-white">
                  Get access to classroom immediately on enrollment
                </h5>
              </Col>
              <Col md="3" className="border-left my-2">
                <h3 className=" text-white">Prerequisites</h3>
                <h2 className=" text-white">None</h2>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <h1 className="display-2 font-weight-700">Curriculum</h1>

        <Container className="mt-5">
          <Row>
            <Col md="7" lg="8">
              <TimeLineWrapper>
                {modulesList.parent.map((data) => (
                  <TimeLineItem
                    isCourseEnrolled={isCourseEnrolled}
                    {...data}
                    key={data._id}
                    subModules={modulesList.sub.filter(
                      ({ parentModule }) => parentModule === data._id
                    )}
                    basicAlert={basicAlert}
                  />
                ))}
              </TimeLineWrapper>
            </Col>
            <Col md="5" lg="4">
              <Card className="shadow-2lg bg-gradient-default text-white ">
                <CardBody className="d-flex flex-column">
                  <Row className="my-2">
                    <Col xs="1">
                      <i className="fas fa-award mr-2" />
                    </Col>
                    <Col xs="10">Certificate on completion</Col>
                  </Row>
                  <Row className="my-2">
                    <Col xs="1">
                      <i className="far fa-smile-beam mr-2" />
                    </Col>
                    <Col xs="10">Beginner</Col>
                  </Row>
                  <Row className="my-2">
                    <Col xs="1">
                      <i className="fas fa-list-ul mr-2" />
                    </Col>
                    <Col xs="10">{listingInfo.lessons} Lessons</Col>
                  </Row>
                  <Row className="my-2">
                    <Col xs="1">
                      <i className="fas fa-cloud-download-alt mr-2" />
                    </Col>
                    <Col xs="10">{listingInfo.resources} Resources</Col>
                  </Row>
                  {isCourseEnrolled ? (
                    <>
                      <div className="my-4 text-white d-flex justify-content-center align-items-center font-weight-700">
                        <i className="fas fa-check-circle mr-1" />
                        {isCourseEnrolled}
                      </div>
                    </>
                  ) : (
                    <Button
                      className="my-4 btn-icon btn-3"
                      type="button"
                      block
                      onClick={validateEnroll}
                    >
                      {reduxState.bootcampReducer.loading ? (
                        <span className="btn-inner--icon">
                          <Spinner size="sm" />
                        </span>
                      ) : (
                        <>
                          <span className="btn-inner--text text-primary font-weight-700">
                            Enroll Now
                          </span>
                          <span className="btn-inner--icon">
                            <i className="fas fa-arrow-right text-primary"></i>
                          </span>
                        </>
                      )}
                    </Button>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
};

Test.layout = Admin;

export default Test;
