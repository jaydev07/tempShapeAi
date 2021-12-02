import { Container, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

// Components
import CertificateCard from "../../../components/CertificateCard/";

// layout for this page
import Admin from "layouts/Admin.js";

// Redux Action
import {
  getAllCertificatesAction,
  getCurrentUserAction,
} from "../../../Redux/reducer/user/user.action";

const CertificateList = () => {
  const [certficates, setCertificates] = useState([]);

  const reduxState = useSelector(({ bootcampReducer, userReducer }) => ({
    bootcampReducer,
    userReducer,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    const getAllCertificates = async () => {
      const { payload } = await dispatch(getAllCertificatesAction());
      if (!reduxState.userReducer.token) await dispatch(getCurrentUserAction());

      setCertificates(payload);
    };
    getAllCertificates();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="display-3 mb-2 font-weight-700">Your certificates </h1>
      <Row>
        {certficates.length ? (
          certficates.map((certficate) => (
            <Col md="4">
              <CertificateCard key={certficate._id} {...certficate} />
            </Col>
          ))
        ) : (
          <h4>No certificates available.</h4>
        )}
      </Row>
    </Container>
  );
};
CertificateList.layout = Admin;

export default CertificateList;
