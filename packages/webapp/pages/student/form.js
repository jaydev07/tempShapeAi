import Auth from "../../layouts/Auth";
import { Container, Row, Col } from "reactstrap";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getCurrentUserStatus,
  setUserStatus,
} from "../../Redux/reducer/user/user.action";
import { useRouter } from "next/router";

const Form = () => {
  const [load, setLoad] = useState(0);

  const dispatch = useDispatch();
  const router = useRouter();
  const check = async () => {
    const { payload } = await dispatch(getCurrentUserStatus());
    if (payload.hasSubmittedInitForm) router.push("/student/dashboard");
  };
  useEffect(() => {
    check();
  }, []);

  const updateStatus = async () => {
    if (load > 1) {
      await dispatch(
        setUserStatus({
          hasSubmittedInitForm: true,
        })
      );
      router.push("/student/dashboard");
    }
  };
  useEffect(() => {
    updateStatus();
  }, [load]);

  return (
    <>
      <Row className="align-items-center d-flex text-center">
        <Col col={"md-6"}>
          <h2 className="display-3 text-white" style={{ padding: "25px" }}>
            Please complete the form
          </h2>
          <iframe
            onLoad={() => setLoad(load + 1)}
            id={"g-form"}
            src="https://docs.google.com/forms/d/e/1FAIpQLSfsjh193pDTRsQCt3rVsnR3lVpD_lV4Y6nxUdLISKQyzEs2_w/viewform?embedded=true"
            width="1140"
            height="955"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
          >
            Loading…
          </iframe>
        </Col>
      </Row>
    </>
  );
};

Form.layout = Auth;

export default Form;
