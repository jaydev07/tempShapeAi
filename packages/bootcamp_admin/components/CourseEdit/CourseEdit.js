import dynamic from "next/dynamic";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Label,
  CardImg,
  CardFooter,
  Button,
} from "reactstrap";

import TagsInput from "../TagsInput/TagsInput";
import CreateableSelectField from "../FormFields/CreateableSelectField";

import { createCategoryAction } from "../../redux/reducers/courses/courses.action";

const ImageUploader = dynamic(() => import("../ImageUpload"), { ssr: false });

const CourseEdit = ({
  setCourseData,
  courseData,
  categoryList,
  saveCourseEdit,
}) => {
  const reduxState = useSelector(({ courses }) => ({ courses }));
  const dispatch = useDispatch();

  const handleCoureDataChange = (name, value) =>
    setCourseData({ ...courseData, [name]: value });

  const handleCategoryChange = async (value) => {
    console.log({ value });
    if (value.__isNew__) {
      const { payload } = await dispatch(
        createCategoryAction(value.value, categoryList)
      );
      // return handleCoureDataChange("category", payload.createCategory._id);
      return console.log({ payload });
    }
    return handleCoureDataChange("category", value._id);
  };

  return (
    <Container>
      <Card>
        <CardBody>
          <Row>
            <Col lg="6">
              <div className="my-3">
                <Label className="font-weight-700">Course Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={courseData.name}
                  onChange={(e) =>
                    handleCoureDataChange("name", e.target.value)
                  }
                />
              </div>
              <div className="my-3">
                <Label className="font-weight-700">Course Name</Label>
                <Input
                  type="textarea"
                  name="description"
                  value={courseData.description}
                  rows="6"
                  onChange={(e) =>
                    handleCoureDataChange("description", e.target.value)
                  }
                />
              </div>
              <div className="my-3">
                <Label>Prerequisites</Label>
                <Input
                  type="text"
                  name="prerequisites"
                  value={courseData.prerequisites}
                  onChange={(e) =>
                    handleCoureDataChange("prerequisites", e.target.value)
                  }
                />
              </div>
              <div className="my-3">
                <Label>Tags</Label>
                <br />
                <TagsInput
                  onlyUnique
                  className="bootstrap-tagsinput border border-default"
                  bsSize="lg"
                  onChange={(value) => handleCoureDataChange("tags", value)}
                  value={courseData.tags || []}
                  tagProps={{ className: "tag badge mr-1" }}
                  inputProps={{
                    className: "",
                    placeholder: "",
                  }}
                />
              </div>
              <div className="my-3">
                <Label>Category</Label>
                <CreateableSelectField
                  placeholder="Select Categories"
                  name="categories"
                  id="categories"
                  isCreatable
                  onChange={(value) => handleCategoryChange(value)}
                  options={categoryList}
                />
              </div>
              <div className="my-3">
                <Label>Skills</Label>
                <br />
                <TagsInput
                  onlyUnique
                  className="bootstrap-tagsinput border border-default"
                  bsSize="lg"
                  onChange={(value) => handleCoureDataChange("skills", value)}
                  value={courseData.skills || []}
                  tagProps={{ className: "tag badge mr-1" }}
                  inputProps={{
                    className: "",
                    placeholder: "",
                  }}
                />
              </div>
            </Col>
            <Col lg="6">
              {courseData.image && (
                <CardImg
                  top
                  src={courseData.image.location}
                  alt="Card image cap"
                  className="img-fluid mb-4 shadow-lg"
                  style={{ height: "300px", borderRadius: "0 3rem" }}
                />
              )}

              <ImageUploader
                btnText={"Edit Course Image"}
                onUploadComplete={(data) =>
                  handleCoureDataChange("image", {
                    key: data[0].key || `${Date.now()}`,
                    location: data[0].objectUrl,
                  })
                }
                label={"Edit Course Image"}
                purpose={"courseImage"}
                shouldUploadOnDrop={true}
              />
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          <Button
            className="float-right"
            color="primary"
            onClick={saveCourseEdit}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default CourseEdit;
