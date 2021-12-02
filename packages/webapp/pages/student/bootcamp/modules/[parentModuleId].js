import { Card, CardBody, Badge, Container, Row, Col, Button } from "reactstrap";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

// layout for this page
import Admin from "layouts/Admin.js";

// Components
import ModuleCard from "../../../../components/ModuleComps/ModuleCard";

// Redux Action
import {
  getSingleBootCampAction,
  getAllModulesAction,
  enrollCourseAction,
  getCourseTrackingDataAction,
} from "../../../../Redux/reducer/bootcamp/bootcamp.action";

const ModuleListing = () => {
  const [moduleList, setModuleList] = useState([]);
  const [trackedModules, setTrackedModule] = useState([]);
  const [parentModuleData, setParentModuleData] = useState({});

  const reduxState = useSelector(({ bootcampReducer, userReducer }) => ({
    bootcampReducer,
    userReducer,
  }));

  const router = useRouter();
  const dispatch = useDispatch();
  const { parentModuleId } = router.query;

  useEffect(() => {
    const loadData = async () => {
      if (parentModuleId) {
        if (!reduxState.bootcampReducer.selectedBootcamp) {
          router.push("/student/search/");
        }

        const modules = await dispatch(
          getAllModulesAction(reduxState.bootcampReducer.selectedBootcamp._id)
        );

        if (modules) {
          const getTrackingData = await dispatch(
            getCourseTrackingDataAction(
              reduxState.bootcampReducer.selectedBootcamp._id
            )
          );
          setParentModuleData(
            modules.payload.filter((module) => module._id === parentModuleId)[0]
          );
          setTrackedModule(getTrackingData.payload.moduleTrackers);
          setModuleList(
            modules.payload.filter(
              ({ parentModule }) => parentModule === parentModuleId
            )
          );
        }
      }
    };
    loadData();
  }, [parentModuleId]);

  const colors = ["primary", "success", "danger", "warning", "default"];
  let count = Math.floor(Math.random() * colors.length);

  return (
    <Container className="py-4">
      <Card className={`bg-${colors[count]}`}>
        <CardBody>
          {reduxState.bootcampReducer.selectedBootcamp && (
            <Link
              href={`/student/bootcamp/${reduxState.bootcampReducer.selectedBootcamp.Id}`}
            >
              <Badge className="text-primary font-weight-600 pointer" pill>
                <i className="fas fa-arrow-left" /> Go back to course page
              </Badge>
            </Link>
          )}
          <h1 className="mt-3 text-white display-3 font-weight-700">
            {parentModuleData.name}
          </h1>
          <p className="text-white description text-muted font-weight-bold">
            {parentModuleData.description}
          </p>
        </CardBody>
      </Card>

      <h1 className="display-3 font-weight-700">Choose Your Modules</h1>
      <Row>
        <Col md="10">
          {moduleList.map((moduleData) => (
            <ModuleCard {...moduleData} trackedModules={trackedModules} />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

ModuleListing.layout = Admin;

export default ModuleListing;
