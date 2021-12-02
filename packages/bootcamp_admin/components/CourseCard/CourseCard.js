import Link from "next/link";
import { Col, Card, CardHeader, CardBody, Badge, Button } from "reactstrap";

const CourseListCard = ({ CourseList, deleteCourse }) => {
  return CourseList.length > 0 ? (
    CourseList.map(
      ({ type, name, description, modules, Id, tags, ...rest }) => (
        <Col xs="12" key={Id}>
          <Card>
            <CardBody>
            <Badge color="default">{type}</Badge>
              <h1>{name}</h1>
              <div>
                <i className="fas fa-cubes" /> {modules.length} Modules &#8226;{" "}
                {rest.prerequisites}
              </div>
              <p className="lead course-description">{description}</p>
              <div className="d-flex flex-wrap">
                {tags.length > 0 &&
                  tags.map((name) => <Badge color="info">{name}</Badge>)}
              </div>
              <Link href={`/courses/edit/${rest._id}`}>
                <Button className="mt-2 float-right" outline>
                  Open Course <i className="fas fa-arrow-right" />
                </Button>
              </Link>
            </CardBody>
          </Card>
        </Col>
      )
    )
  ) : (
    <h1>No result found</h1>
  );
};

export default CourseListCard;
