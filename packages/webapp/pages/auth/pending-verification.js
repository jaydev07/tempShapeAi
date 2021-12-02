import Auth from "../../layouts/Auth";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import React, { useEffect } from "react";
import LottieAnimation from "react-lottie";

// Lottie files
import ConfirmMail from "../../assets/lottie/confirmmail.json";
import { useDispatch } from "react-redux";
import {
  getCurrentUserAction,
  getCurrentUserStatus,
} from "../../Redux/reducer/user/user.action";
import { useRouter } from "next/router";

const PendingVerification = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: ConfirmMail,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const dispath = useDispatch();
  const router = useRouter();
  useEffect(async () => {
    const { payload } = await dispath(getCurrentUserAction());
    if (payload.isVerified) {
      const status = await dispath(getCurrentUserStatus());
      if (!status.payload.hasSubmittedInitForm) router.push("/student/form");
      else router.push("/student/dashboard");
    }
  }, []);
  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="6">
            <Card>
              <CardBody className="text-center">
                <LottieAnimation
                  options={defaultOptions}
                  height={200}
                  width={200}
                />
                <h2 className="text-default display-3 font-weight-800">
                  Thank you for signing up!
                </h2>
                <p className="lead">
                  A confirmation mail has been sent, please check your inbox and
                  click on{" "}
                  <strong className="text-primary">"verify email"</strong>{" "}
                  button to complete the registration.
                </p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

PendingVerification.layout = Auth;

export default PendingVerification;
