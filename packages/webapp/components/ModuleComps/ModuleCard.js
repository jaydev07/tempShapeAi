import React from "react";
import { Card, CardBody, Badge, Progress, Button, Row, Col } from "reactstrap";
import { useRouter } from "next/router";

const ModuleCard = ({
  _id,
  name,
  description,
  isProjectModule,
  trackedModules,
  ...rest
}) => {
  const [trackData, settrackData] = React.useState({});
  const router = useRouter();

  React.useEffect(() => {
    settrackData(trackedModules.filter(({ module }) => module === _id)[0]);
  }, []);

  const redirect = (e) =>
    router.push(`/student/bootcamp/learns/${e.target.id}`);

  const colors = ["primary", "success", "danger", "warning", "default"];
  let count = Math.floor(Math.random() * colors.length);
  return (
    <>
      <Card
        key={_id}
        className={`border-${colors[count]}-5-left my-4 shadow-2lg`}
      >
        <CardBody>
          {isProjectModule && (
            <Badge
              className={`my-2 bg-gradient-${colors[count]} text-white text-capitalize`}
            >
              Project Based Module
            </Badge>
          )}
          {rest.isOptionModule && (
            <Badge
              className={`my-2 bg-gradient-${colors[count]} text-white text-capitalize`}
            >
              Project Based Module
            </Badge>
          )}
          {rest.isCertificateAvailable && (
            <Badge
              className={`my-2 bg-gradient-${colors[count]} text-white text-capitalize`}
            >
              Certified Module
            </Badge>
          )}
          <h2 className="font-weight-700">{name}</h2>
          <p className="description text-muted font-weight-bold">
            {description || "No description available"}
          </p>
          <Row className="justify-content-between align-items-center">
            <Col xs="6">
              <div className=" progress-wrapper">
                <div className=" progress-info">
                  <div className=" progress-percentage">
                    <Badge className={`text-${colors[count]} text-capitalize`}>
                      {parseInt(trackData.percentageCompleted) > 100
                        ? "100"
                        : Math.round(trackData.percentageCompleted)}
                      % Completed
                    </Badge>
                  </div>
                </div>
                <Progress
                  max="100"
                  value={
                    parseInt(trackData.percentageCompleted) > 100
                      ? "100"
                      : Math.round(trackData.percentageCompleted)
                  }
                  color={colors[count]}
                ></Progress>
              </div>
            </Col>
            <Col xs="4">
              <Button
                color="primary"
                className="float-right"
                outline
                onClick={redirect}
                id={_id}
              >
                Start Learning <i className="fas fa-arrow-right ml-2" />
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  );
};

export default ModuleCard;
