import { Card, CardBody, Badge, Button } from "reactstrap";
import { useRouter } from "next/router";

const VerticalTimeLineItem = ({ name, description, basicAlert, ...props }) => {
  const router = useRouter();

  const colors = ["primary", "success", "danger", "warning", "default"];
  let count = Math.floor(Math.random() * colors.length);

  const redirect = () => router.push(`/student/bootcamp/modules/${props._id}`);

  return (
    <div className="timeline-block">
      <span className={`timeline-step badge-${colors[count]}`}>
        <i className="fas fa-circle fa-xs" />
      </span>
      <div className="timeline-content">
        <Card className={`border-${colors[count]}-5-left`}>
          <CardBody>
            {props.isProjectModule && (
              <Badge
                className={`my-2 bg-gradient-${colors[count]} text-white text-capitalize`}
              >
                Project Based Module
              </Badge>
            )}
            <h2 className="font-weight-700">{name}</h2>
            <p className="description text-muted font-weight-bold truncate-4-lines">
              {description || "No description available"}
            </p>

            <div>
              <Badge className="text-white bg-gradient-primary">
                {props.subModules.length} Modules
              </Badge>
              <Badge className="text-white bg-gradient-primary">
                {props.resources.length} Resources
              </Badge>
            </div>

            <Button
              color="primary"
              outline
              className="mt-2 float-right d-lg-none"
              size="sm"
              onClick={
                !props.isCourseEnrolled
                  ? () => alert("Please enroll to this course!")
                  : redirect
              }
            >
              View <i className="fas fa-arrow-right ml-2" />
            </Button>
            <Button
              color="primary"
              outline
              className="float-right d-none d-lg-block"
              onClick={
                !props.isCourseEnrolled
                  ? () => alert("Please enroll to this course!")
                  : redirect
              }
            >
              View <i className="fas fa-arrow-right ml-2" />
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default VerticalTimeLineItem;
