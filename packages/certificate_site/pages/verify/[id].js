import { Container, Row, Col } from "reactstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import Head from "next/head";

import graphQlClient from "../../configs/ApolloClient.config";
import { GET_CERTIFICATE_QUERY } from "../../gql/getCertificate";
import { GET_ALL_MODULES_QUERY } from "../../gql/getAllModules";
import { GET_SINGAL_BOOTCAMPS_QUERY } from "../../gql/getSingleBootcamp";

const getCertificate = async (id) => {
  console.log({ id });
  const { data } = await graphQlClient.query({
    query: GET_CERTIFICATE_QUERY,
    variables: { credentialId: id },
  });
  if (data) return data.getCertificate;
  return null;
};

const getSingleBootcamp = async (Id, _id, isDraft) => {
  const variables = { Id, _id, isDraft };
  if (!Id) delete variables.Id;
  if (!_id) delete variables._id;

  const { data } = await graphQlClient.query({
    query: GET_SINGAL_BOOTCAMPS_QUERY,
    variables,
  });
  if (data) return data.getCourse;
  return null;
};

const getAllModulesAction = (courseId, ids) => async (dispatch) => {
  const { data } = await graphQlClient.query({
    query: GET_ALL_MODULES_QUERY,
    variables: { courseId, ids },
  });
  if (data) return data.getModules;
  return null;
};

const Certificate = ({ CertificateData }) => {
  const [certficates, setCertificates] = useState({
    purposeName: "",
    imgUrl: "",
    pdfUrl: "",
  });
  const [certData, setCertData] = useState({
    course: "",
    module: "",
    imgUrl: "  ",
  });
  const [certInvalid, setCertInvalid] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const setCertD = async () => {
    const c = await getCertificate(id);
    if (!c) setCertInvalid(true);
    setCertificates(c);
    setCertData(c);
  };

  getSingleBootcamp(null, "608963755a1e3473fe09bec4").then((data) =>
    console.log({ data })
  );

  useEffect(() => {
    if (id) setCertD();
  }, [id]);

  if (certInvalid)
    return (
      <>
        <h1>Certificate Does Not Exist</h1>
      </>
    );
  return (
    <>
      {certData.imgUrl ? (
        <>
          <Head>
            <script
              async
              src="https://platform.twitter.com/widgets.js"
              charset="utf-8"
            ></script>
            <script
              async
              src="https://static.addtoany.com/menu/page.js"
            ></script>
            <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
              integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
              crossorigin="anonymous"
            />
            <title>Certificate of completion {certData.course}</title>
          </Head>
          <Container className="mt-4">
            <Row>
              <Col md="8">
                <img
                  src={certficates.imgUrl}
                  alt="certificare"
                  className="img-fluid shadow-lg"
                />
                <div>
                  <p className="lead mt-4" style={{ fontWeight: "400" }}>
                    This certificate above verifies that{" "}
                    <span
                      className="text-primary"
                      style={{ fontWeight: "500" }}
                    >
                      {certficates.userFullName}
                    </span>{" "}
                    successfully completed the{" "}
                    <span
                      className="text-primary"
                      style={{ fontWeight: "500" }}
                    >
                      {certficates.purposeName}
                    </span>{" "}
                    {/*on {moment(certficates.createAt).format("DD MMM YYYY")}. The*/}
                    on the date given on the certificate above.
                    This certificate indicates that the entire {certficates.purposeName}{" "}
                    was completed by the student.
                  </p>
                </div>
              </Col>
              <Col md="4" className="">
                <div>
                  <h2 className="text-primary">Certificate recipient</h2>
                  <h4>{certficates.userFullName}</h4>
                </div>
                
                <div className="mt-5 d-flex flex-column align-items-center align-self-baseline">
                  <h5>Issued By</h5>
                  <div>
                    <img
                      src={
                        "https://shapeai-uploads.s3.ap-south-1.amazonaws.com/logo-high.svg"
                      }
                      alt={"Shape AI"}
                      className="img-fluid"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        "Loading"
      )}
    </>
  );
};
// Certificate.getInitialProps = async function getInitialProps(context) {
// 	const { data } = await graphQlClient.query({
// 		query: GET_CERTIFICATE_QUERY,
// 		variables: { credentialId: context.query.id },
// 	});
// 	console.log(data.getCertificate)
// 	return {
// 		CertificateData: data.getCertificate  // will be passed to the page component as props
// 	};
// }

export default Certificate;
