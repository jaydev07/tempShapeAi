import { Row, Col, Card, CardBody, Badge, CardImg } from "reactstrap";
import Link from "next/link";
import moment from "moment";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const DashboardCard = ({ courseData, currentModule }) => {
  return (
    courseData && (
      <SkeletonTheme color="#dadde3">
        <Card className="shadow-lg">
          {courseData.image && (
            <CardImg
              top
              src={courseData.image && courseData.image.location}
              alt="course thumbnail"
              className="border-none rounded-none"
              height="200"
              style={{ borderStyle: "none", borderRadius: "none" }}
            />
          )}
          <CardBody>
            {courseData.type ? (
              <Badge
                className="bg-gradient-primary text-white font-weight-800 my-2"
                pill
              >
                {courseData.type}
              </Badge>
            ) : (
              <Skeleton width={50} />
            )}
            <div className="d-flex justify-content-between align-items-center">
              <h5>
                Enrolled On:{" "}
                {courseData.createdAt ? (
                  moment(courseData.createdAt).format("DD MMM YYYY")
                ) : (
                  <Skeleton width={70} />
                )}
              </h5>
            </div>
            <h1>{courseData.name || <Skeleton height={30} />}</h1>
            <Card className="bg-gradient-info shadow-lg">
              <CardBody className="text-white">
                {currentModule ? (
                  <>
                    <h4 className="text-white">Next Lesson</h4>
                    <div className="d-flex justify-content-between align-items-end">
                      <div>
                        {currentModule.units.length ? (
                          currentModule.units.map(
                            ({ unit }) =>
                              unit._id === courseData.currentTask && (
                                <i>{unit.name}</i>
                              )
                          )
                        ) : (
                          <Skeleton width={70} />
                        )}
                      </div>

                      <Link
                        href={`/student/bootcamp/learns/${courseData.trackedRoute[1]}`}
                      >
                        <i className="fas fa-arrow-right pointer" />
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <i className="fas fa-check-circle text-white" /> Course
                    Completed{" "}
                  </>
                )}
              </CardBody>
            </Card>
          </CardBody>
        </Card>
      </SkeletonTheme>
    )
  );
};

export default DashboardCard;
