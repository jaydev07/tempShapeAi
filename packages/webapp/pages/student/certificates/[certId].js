import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Badge,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import Head from "next/head";

// Components
import CertificateCard from "../../../components/CertificateCard/";

// layout for this page
import Admin from "layouts/Admin.js";

// Redux Action
import { getCertificateAction } from "../../../Redux/reducer/user/user.action";
import {
  getSingleBootCampAction,
  getAllModulesAction,
} from "../../../Redux/reducer/bootcamp/bootcamp.action";
import graphQlClient from '../../../config/ApolloClient.config';
import {GET_CERTIFICATE_QUERY} from '../../../gql/user';

const Certificate = ({ CertificateData }) => {
  console.log({ CertificateData });
  const [certficates, setCertificates] = useState({});
  const [certData, setCertData] = useState({ course: "", module: "" });

  const reduxState = useSelector(({ bootcampReducer }) => ({
    bootcampReducer,
  }));

  const dispatch = useDispatch();
  const router = useRouter();
  const { certId } = router.query;

  useEffect(() => {
    const getCertificate = async () => {
      setCertificates(CertificateData);
      if (CertificateData) {
        const getCourse = await dispatch(
          getSingleBootCampAction("", CertificateData.course, true)
        );
        setCertData({
          course: getCourse.payload.name,
          module: CertificateData.accomplishmentType === 'module' ? (await dispatch(
            getAllModulesAction("", [CertificateData.module])
          )).payload[0].name : '',
        });
      }
    };
    getCertificate();
  }, []);

  return (
    <>
      <Head>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charset="utf-8"
        ></script>
        <script async src="https://static.addtoany.com/menu/page.js"></script>
        <title>
          Certificate of completion {certData.course}
        </title>
      </Head>
      <Container className="mt-4">
        <Row>
          <Col md="8">
            <img
              src={certficates.imgUrl}
              alt="certificare"
              className="img-fluid shadow-2lg"
            />
          </Col>
          <Col>
            <h3 className="mt-4 font-weight-700">Share your certificate..</h3>
            <div className="mb-4 d-md-flex flex-column">
              <div>
                <a
                  href="https://twitter.com/share?ref_src=twsrc%5Etfw"
                  class="twitter-share-button"
                  data-text="Check out certificate"
                  data-url={certficates.imgUrl}
                  data-related="@ai_shape"
                  data-show-count="false"
                >
                  Tweet
                </a>
              </div>
              <div class="a2a_kit a2a_default_style">
                <a
                  class="a2a_button_linkedin_share"
                  data-url={certficates.imgUrl}
                  data-text="Check out certificate"
                ></a>
              </div>
            </div>
            <h3 className="font-weight-700">Download your certificate..</h3>
            <UncontrolledDropdown>
              <DropdownToggle
                caret
                color="primary"
                id="dropdownMenuButton"
                type="button"
                outline
              >
                Choose Format
              </DropdownToggle>

              <DropdownMenu aria-labelledby="dropdownMenuButton">
                <DropdownItem href="#pablo">
                  <a
                    target="_blank"
                    href={certficates.pdfUrl}
                    referrerPolicy="no-referrer"
                    download
                  >
                    <i className="far fa-file-pdf text-danger" /> PDF format
                  </a>
                </DropdownItem>

                <DropdownItem href="#pablo">
                  <a
                    target="_blank"
                    href={certficates.imgUrl}
                    referrerPolicy="no-referrer"
                    download
                  >
                    <i className="far fa-image text-info" /> Image format
                  </a>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Col>
        </Row>

        <h1 className="mt-4">
          You Earned this certificate for succesfully completing{" "}
          {
            CertificateData.accomplishmentType === 'module' ?
               <> <span className="font-weight-700 text-primary">
            {certData.module}
          </span>{" "} module of the{" "} </> : ''
          }
          
          
          <span className="font-weight-700 text-primary">
            {certData.course}
          </span>{" "}
          course on{" "}
          <span className="font-weight-700 text-primary">
            {moment(certficates.createAt).format("DD MMM YYYY")}
          </span>
        </h1>
      </Container>
    </>
  );
};
Certificate.layout = Admin;
Certificate.getInitialProps = async function getInitialProps(context) {
  const { data } = await graphQlClient.query({
    query: GET_CERTIFICATE_QUERY,
    variables: { credentialId: context.query.certId },
  });
  console.log(data.getCertificate)
  return {
      CertificateData: data.getCertificate  // will be passed to the page component as props
  };
}

export default Certificate;
