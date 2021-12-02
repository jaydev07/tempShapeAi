import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { verifyUserEmail } from "../../Redux/reducer/user/user.action";
import { useState } from "react";
import Spinner from "reactstrap/lib/Spinner";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

const UserVerify = () => {
	const router = useRouter();
	const { token } = router.query;
	const dispatch = useDispatch();
	const [isVerified, setVerifiedStatus] = useState(false);
	const [loading, setLoading] = useState(true);
	
	const verify = async () => {
		const { payload } = await dispatch(verifyUserEmail(token));
		setVerifiedStatus(payload.isVerified);
		setLoading(false);
	};
	
	useEffect(() => {
		if (isVerified) {
			setTimeout(() => {
				router.push('/student/form');
			}, 500);
		}
	}, [isVerified]);
	
	useEffect(() => {
		verify();
	}, []);
	
  return (
    <>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="6">
            <Card>
              <CardBody className="text-center">
                {" "}
                {loading ? (
                  <Spinner color="primary" />
                ) : isVerified ? (
                  <h1 className="text-default font-weight-800">
                    {" "}
                    Account Verified. Redirecting ...{" "}
                  </h1>
                ) : (
                  <h1 className="text-danger font-weight-800"> Invalid Url </h1>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserVerify;