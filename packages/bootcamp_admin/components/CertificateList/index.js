import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  UncontrolledCollapse,
  CardImg,
  Collapse,
} from "reactstrap";

// Redux Action
import {
  updateModuleDetailsAction,
  getCertficateTemplateAction,
} from "../../redux/reducers/courses/courses.action";

const CertficateComponent = ({ focusModule, setFocusModule }) => {
  const [certificateToggle, setCertificateToggle] = useState(false);
  const [certficateTemplate, setCertificateTemplate] = useState([]);
  const [
    selectedCertificateTemplate,
    setSelectedCertificateTemplate,
  ] = useState("");
  const [toggleCertificateCollapse, setToggleCertificateCollapse] = useState(
    false
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      const { payload } = await dispatch(getCertficateTemplateAction());
      setCertificateTemplate(payload);
    };
    loadData();
  }, []);

  useEffect(() => {
    const removeCertificate = async () => {
      if (!certificateToggle && focusModule.isCertificateAvailable) {
        const { payload } = await dispatch(
          updateModuleDetailsAction({
            id: focusModule._id,
            isCertificateAvailable: false,
            certificateTemplate: null,
          })
        );

        setFocusModule({ ...focusModule, ...payload });
      }
    };
    removeCertificate();
  }, [certificateToggle]);

  const updateCertificateDetails = async () => {
    const { payload } = await dispatch(
      updateModuleDetailsAction({
        id: focusModule._id,
        isCertificateAvailable: certificateToggle,
        certificateTemplate: selectedCertificateTemplate,
      })
    );

    return setFocusModule({ ...focusModule, ...payload });
  };

  return (
    <>
      <div className="d-flex align-items-center">
        <Badge className="my-2 bg-primary font-weight-700 text-white text-capitalize">
          Is this a Certified Module ?
        </Badge>
        <label className=" custom-toggle">
          <input
            defaultChecked={focusModule.isCertificateAvailable}
            onChange={(e) => setCertificateToggle(e.target.checked)}
            type="checkbox"
          ></input>
          <span
            className=" custom-toggle-slider rounded-circle"
            data-label-off="No"
            data-label-on="Yes"
          ></span>
        </label>
      </div>
      <div className={classnames({ "d-none": !certificateToggle })}>
        <h4
          className="pointer"
          onClick={() =>
            setToggleCertificateCollapse(!toggleCertificateCollapse)
          }
        >
          Choose certification{" "}
          <i
            className={classnames({
              "fas fa-chevron-right": !toggleCertificateCollapse,
              "fas fa-chevron-down": toggleCertificateCollapse,
            })}
          />
        </h4>
        <Collapse isOpen={toggleCertificateCollapse}>
          <Container className="my-5">
            <Row>
              {certficateTemplate.map(({ _id, imageUrl, type }) => (
                <Col md="6" key={_id}>
                  <Card
                    className={
                      ("pointer",
                      classnames({
                        "border border-primary":
                          selectedCertificateTemplate === _id,
                      }))
                    }
                  >
                    <CardImg
                      src={imageUrl}
                      alt="certificate"
                      top
                      onClick={() => setSelectedCertificateTemplate(_id)}
                    />
                    <h4
                      className={classnames(
                        "text-center my-2 font-weight-700",
                        {
                          "text-primary": selectedCertificateTemplate === _id,
                        }
                      )}
                      onClick={() => setSelectedCertificateTemplate(_id)}
                    >
                      {type}
                    </h4>
                  </Card>
                </Col>
              ))}
            </Row>
            <Button
              onClick={updateCertificateDetails}
              className="float-right"
              color="primary"
            >
              Save
            </Button>
          </Container>
        </Collapse>
      </div>
    </>
  );
};

export default CertficateComponent;
