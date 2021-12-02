import Link from "next/link";
import { Col, Card, Row, CardBody, Badge, Button, Container } from "reactstrap";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useMediaQuery } from "react-responsive";
import "../../assets/scss/styles/search.module.scss";

const CourseListCard = ({ CourseList, isLoading }) => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 774px)",
  });

  return isLoading ? (
    <SkeletonTheme color="#dadde3">
      <Card>
        <CardBody>
          <Skeleton width={70} />
          <Skeleton height={30} />
          <div className="my-3 d-flex align-items-center">
            <Skeleton height={10} width={50} className="mr-2" />
            <Skeleton height={10} width={50} className="mr-2" />
            <Skeleton height={10} width={50} />
          </div>
          <Skeleton height={10} />
          <Skeleton height={10} width={550} />
          <Skeleton height={10} width={250} />
        </CardBody>
      </Card>
    </SkeletonTheme>
  ) : CourseList.length > 0 ? (
    CourseList.map(
      ({ type, name, description, modules, Id, tags, ...rest }) => (
        <Card className="shadow-lg">
          <CardBody>
            <Row>
              <Col
                md="4"
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <img
                  alt={name}
                  style={{
                    height: "140px",
                  }}
                  src={
                    "https://shapeai-uploads.s3.ap-south-1.amazonaws.com/course-default.jpeg"
                  }
                />
                <Link href={`/student/bootcamp/${Id}`}>
                  <Button
                    color="primary"
                    className="my-3 bg-gradient-primary"
                    block
                  >
                    Program Details
                  </Button>
                </Link>
                <Button outline className="my-1" block>
                  Download Syllabus
                </Button>
              </Col>
              <Col md="8" key={Id}>
                <Badge className="my-1 bg-gradient-primary text-white">
                  {type}
                </Badge>
                <h1 className="text-default font-weight-700">{name}</h1>
                <p className="description text-muted font-weight-bold truncate-4-lines mt-2">
                  {description}
                </p>
                <Row>
                  <Col className="text-default ">
                    <i className="fas fa-cubes text-default " />{" "}
                    {modules.length} Modules
                  </Col>
                  <Col>
                    <h3 className="text-default ">
                      Prerequisites <Badge>{rest.prerequisites} </Badge>
                    </h3>
                  </Col>
                </Row>
                <h3 className="text-default ">Skills Covered</h3>
                <div className="d-flex flex-wrap">
                  {rest.skills.length > 0 &&
                    rest.skills.map((name) => (
                      <Badge color="info">{name}</Badge>
                    ))}
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      )
    )
  ) : (
    <h1>No result found</h1>
  );
};

export default CourseListCard;
