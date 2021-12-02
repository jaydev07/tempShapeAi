import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Input,
  Form,
  Button,
  Label,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import dynamic from "next/dynamic";

// Components
import CommitHeatmap from "../../components/CommitHeatmap";

// Redux Action
import { getCommitsDataAction } from "../../Redux/reducer/bootcamp/bootcamp.action";
import {
  updateUserProfileAction,
  updateUserProfileImageAction,
  getCurrentUserAction,
} from "../../Redux/reducer/user/user.action";

// layout for this page
import Admin from "layouts/Admin.js";

const ImageUploader = dynamic(() => import("../../components/ImageUpload"), {
  ssr: false,
});

const UserProfile = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [image, setImage] = useState({ key: "", location: "" });
  const [userData, setuserData] = useState({
    name: { lastName: "", firstName: "" },
    email: "",
  });

  const reduxStore = useSelector(({ userReducer }) => ({ userReducer }));

  const dispatch = useDispatch();

  useEffect(() => {
    const getProfilePageData = async () => {
      if (!reduxStore.userReducer.token) await dispatch(getCurrentUserAction());

      const headMapData = await dispatch(
        getCommitsDataAction(reduxStore.userReducer.user._id)
      );
      setHeatmapData(headMapData.payload);
      setuserData({
        email: reduxStore.userReducer.user.email,
        name: {
          firstName: reduxStore.userReducer.user.name.firstName,
          lastName: reduxStore.userReducer.user.name.lastNamelastName,
        },
      });
      setImage(reduxStore.userReducer.user.profilePicture);
    };
    getProfilePageData();
  }, []);

  const handleChange = (e) =>
    setuserData({
      ...userData,
      name: { ...userData.name, [e.target.name]: e.target.value },
    });

  const saveProfile = async (e) => {
    e.preventDefault();
    const { payload } = await dispatch(
      updateUserProfileAction({ name: userData.name, profilePicture: image })
    );

    setuserData({
      email: payload.email,
      name: {
        firstName: payload.firstName,
        lastName: payload.lastNamelastName,
      },
    });
  };

  const saveProfileImage = async (imageObj) => {
    setImage(imageObj);
    await dispatch(updateUserProfileImageAction(imageObj));
  };

  return (
    <>
      <Head>
        <title>Student - Profile</title>
      </Head>
      <Container className="mt-4 relative" fluid>
        <Row className="justify-content-center">
          <Col md="10" lg="6">
            <Card>
              <CardHeader className="font-weight-700 h2">
                Your Profile
              </CardHeader>
              <CardBody>
                <Row>
                  <Col md="6">
                    <img
                      src={image.location}
                      alt="user"
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        backgroundPosition: "center center",
                        backgroundSize: "cover",
                      }}
                    />
                  </Col>
                  <Col md="6">
                    <ImageUploader
                      btnText={"Upload New Profile Picture"}
                      onUploadComplete={(data) =>
                        saveProfileImage({
                          key: data[0].key || `${Date.now()}`,
                          location: data[0].objectUrl,
                        })
                      }
                      label={"Upload New Profile Picture"}
                      purpose={"courseImage"}
                      shouldUploadOnDrop={true}
                      withPreview={false}
                    />
                  </Col>
                </Row>

                <Row className="mt-3 mb-3">
                  <Col>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      placeholder="First Name"
                      name="firstName"
                      type="text"
                      value={userData.name.firstName}
                      onChange={handleChange}
                    ></Input>
                  </Col>
                  <Col>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      placeholder="Last Name"
                      name="lastName"
                      type="text"
                      value={userData.name.lastName}
                      onChange={handleChange}
                    ></Input>
                  </Col>
                </Row>
                <Label htmlFor="email">Email</Label>
                <Input
                  placeholder="Email"
                  type="email"
                  name="email"
                  value={userData.email}
                  readOnly
                ></Input>
                <Button
                  className="my-3"
                  type="button"
                  color="primary"
                  onClick={saveProfile}
                >
                  Save
                </Button>

                <div className="mt-3">
                  {heatmapData.length > 0 ? (
                    <CommitHeatmap data={heatmapData} />
                  ) : (
                    <Card>
                      <CardBody>
                        <h3>Start your course to enable progess.</h3>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

UserProfile.layout = Admin;

export default UserProfile;
