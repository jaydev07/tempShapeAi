import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";

// Components
import CourseCard from "../../components/CourseCard/DashboardCard";
import CommitHeatmap from "../../components/CommitHeatmap";
import LineChart from "../../components/LineChart/";

// Custom Hook
import useUser from "../../hooks/useUser";

// utils
import { processModules } from "../../utils/bootcamp";
import { processModulesd } from "../../utils/bootcamp/d";

import {
  getSingleBootCampAction,
  getAllModulesAction,
  getCourseTrackingDataAction,
  getCommitsDataAction,
  getCurrentTrackingDataAction,
} from "../../Redux/reducer/bootcamp/bootcamp.action";
import { getCurrentUserAction } from "../../Redux/reducer/user/user.action";

// layout for this page
import Admin from "layouts/Admin.js";

const Dashboard = () => {
  const reduxStore = useSelector(({ userReducer }) => ({ userReducer }));
  const [heatmapData, setHeatmapData] = React.useState([]);
  const [courseData, setCourseData] = React.useState({ trackedRoute: [0, 1] });
  const [currentModule, setCurrentModule] = React.useState({ units: [] });
  const dispatch = useDispatch();
  const router = useRouter();

  React.useEffect(() => {
    const getDashboardData = async () => {
      if (!reduxStore.userReducer.token) await dispatch(getCurrentUserAction());

      if (reduxStore.userReducer.user.enrolledCourseId) {
        const getCourse = await dispatch(
          getSingleBootCampAction(reduxStore.userReducer.user.enrolledCourseId)
        );
        if (getCourse.payload) {
          const { payload } = await dispatch(
            getCourseTrackingDataAction(getCourse.payload._id)
          );

          const getModules = await dispatch(
            getAllModulesAction(getCourse.payload._id)
          );
          const tracker = processModules(getModules.payload, payload);
          const trackerd = processModulesd(getModules.payload, payload);
          console.log({ tracker, trackerd });
          const filterModule = getModules.payload.filter(
            ({ _id }) => _id === payload.currentModule
          );
          setCurrentModule(filterModule[0]);
          setCourseData({
            ...getCourse.payload,
            ...payload,
            trackedRoute: tracker.moduleTrack,
          });
        }
        const headMapData = await dispatch(
          getCommitsDataAction(reduxStore.userReducer.user._id)
        );
        setHeatmapData(headMapData.payload);
      }
    };
    getDashboardData();
  }, [router.pathname]);

  return (
    <>
      <Head>
        <title>Student - Dashboard</title>
      </Head>

      <Container className="mt-4 relative" fluid>
        <Row className="mb-3">
          <Col xl={"12"}>
            <Row>
              <Col md="6" lg="5">
                <h1>Continue Learning</h1>
                {reduxStore.userReducer.loading && (
                  <CourseCard
                    courseData={courseData}
                    currentModule={currentModule}
                  />
                )}
                {!reduxStore.userReducer.loading && courseData.name ? (
                  <CourseCard
                    courseData={courseData}
                    currentModule={currentModule}
                  />
                ) : (
                  <Card>
                    <CardBody>
                      <h3>
                        Please enroll in any of our{" "}
                        <Link href="/student/search/">
                          <span className="text-primary pointer">courses</span>
                        </Link>
                      </h3>
                    </CardBody>
                  </Card>
                )}
              </Col>
            </Row>
          </Col>

          <Col lg="8">
            <Card>
              <CardHeader>
                <h5 className="h3 mb-0">Your Progress</h5>
              </CardHeader>
              <CardBody>
                {heatmapData.length > 0 ? (
                  <CommitHeatmap data={heatmapData} />
                ) : (
                  <Card>
                    <CardBody>
                      <h3>Start your course to enable progess.</h3>
                    </CardBody>
                  </Card>
                )}
              </CardBody>
            </Card>
          </Col>
          {/*<Col md="4">*/}
          {/*  <LineChart chartSmall heading="Total Hours Spent" />*/}
          {/*</Col>*/}
        </Row>
        <Row></Row>
      </Container>
    </>
  );
};

Dashboard.layout = Admin;

async function getServerSideProps(context) {
  return {
    props: { message: "Dashboard SSr render" }, // will be passed to the page component as props
  };
}

export default Dashboard;
