import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, Container, Row, Col, Label, Spinner, Alert } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";


// Redux actions
import { registerUserAction } from "../../Redux/reducer/user/user.action";

// Styles
// import "../../assets/scss/styles/login.module.scss";
import "../../assets/css/register.css";
import Link from 'next/link';
const Register = () => {
  const [blocking, setBlocking] = React.useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [serverError, setServerError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const reduxState = useSelector(({ userReducer, errorReducer }) => ({
    userReducer,
    errorReducer,
  }));

  useEffect(() => setServerError(reduxState.errorReducer.error), [
    reduxState.errorReducer,
  ]);

  const handleInputCredentials = (e) => {
    setBlocking(false);
    setServerError('');
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
  }
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setBlocking(true);
      const { payload } = await dispatch(
        registerUserAction({
          user: {
            name: {
              firstName: userCredentials.firstName,
              lastName: userCredentials.lastName,
            },
            email: userCredentials.email,
            password: userCredentials.password,
            phone: userCredentials.phone,
          },
        })
      );
      setBlocking(false);
  
      if (payload.token) {
        router.push("/auth/pending-verification");
      }
    } catch (error) {
      setBlocking(false);
      // TODO: implement error handling
      console.log({ error });
    }
  };
  return (
    <>
      <Head>
        <title>ShapeAI - Register</title>
        
      </Head>
      <div>
        <div className="w-row">
          <div className="column-6 w-col w-col-5">
            <div className="container-11 w-container">
              <img
                src="https://uploads-ssl.webflow.com/604cac9b9d1aac837756f953/6060617e59cb0e6801f2223f_image%201.png"
                loading="lazy" width="175" alt="" className="image-24" />
              <h1 className="heading-17">The biggest virtual event you’ve never seen.</h1>
              <div className="bullet-container">
                <div className="list-item-1">
                  <div className="text-block-5"><strong className="bold-text-10">🚀</strong></div>
                  <div className="text-block-4"><strong>Workshops.</strong> Learn the skills needed to succeed as a
                    designer in 2020.
                  </div>
                </div>
                <div className="list-item-1">
                  <div className="text-block-5"><strong className="bold-text-10">😃</strong></div>
                  <div className="text-block-4"><strong>Workshops.</strong> Learn the skills needed to succeed as a
                    designer in 2020.
                  </div>
                </div>
                <div className="list-item-1">
                  <div className="text-block-5"><strong className="bold-text-10">✌<br/></strong></div>
                  <div className="text-block-4"><strong>Mentoring Sessions. </strong>Learn from our speakers, 1 on 1.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column-7 w-col w-col-7">
            <div className="div-block-38" style={{ paddingTop: '50px' }}>
              <h1 className="heading-18">Sign Up</h1>
              <img
                src="https://uploads-ssl.webflow.com/604cac9b9d1aac837756f953/606173d072911446c73b2838_5f519cbbddf17ed24dc2539f_Group%201.png"
                loading="lazy" width="356" alt="" className="image-23"/>
              <p className="paragraph-2"><strong className="bold-text-11">Join these and 5000+ other Developers</strong>
              </p>
                        <Alert color="danger" isOpen={serverError}>
                          <span className="alert-text">{serverError}</span>
                       </Alert>
              <div className="sign-in-input">
                <div className="form-block-2 w-form">
                  <form onSubmit={handleSubmit} className="form">
                    <input type="text"
                           className="text-field w-input"
                           maxLength="256"
                           placeholder="First Name"
                           name="firstName"
                           value={userCredentials.firstName}
                           onChange={handleInputCredentials}
                    />
                    <input type="text"
                           className="text-field w-input"
                           maxLength="256"
                           data-name="Name 2"
                           placeholder="Last Name"
                           name="lastName"
                           value={userCredentials.lastName}
                           onChange={handleInputCredentials}
                    />
                    <input type="email"
                           className="text-field w-input"
                           maxLength="256"
                           data-name="Email"
                           placeholder="Fancy Email"
                           name="email" required=""
                           value={userCredentials.email}
                           onChange={handleInputCredentials}

                    />
                    <input type="password"
                           className="text-field w-input"
                           maxLength="256" name="password"
                           data-name="Email 2" placeholder="Password"
                           id="password"
                           required=""
                           value={userCredentials.password}
                           onChange={handleInputCredentials}
                    />
                    <input type="tel"
                           className="text-field w-input"
                           maxLength="12"
                           minLength={"10"}
                           data-name="Name 2"
                           placeholder="Mobile Number"
                           name="phone"
                           value={userCredentials.phone}
                           onChange={handleInputCredentials}
                    />
                    <button type="submit"
                            disabled={blocking}
                            className="submit-button-3 w-button" >
                      {blocking ? 'Please Wait..': 'Sign Up'}
                    </button>
                  </form>
                  <div className="w-form-done">
                    <div>Thank you! Your submission has been received!</div>
                  </div>
                  <div className="w-form-fail">
                    <div>Oops! Something went wrong while submitting the form.</div>
                  </div>
                </div>
              </div>
              <div className="text-block-6">Already On Shape AI?
                <Link href={'/auth/login'}><span style={{ cursor: 'pointer' }} className="text-span-2"><strong
                className="bold-text-12">Sign In</strong></span>
              </Link></div>
            </div>
          </div>
        </div>
      </div>
      {/*<section>*/}
      {/*  <Container className="auth__container pt-5">*/}
      {/*    <Row className="align-items-center">*/}
      {/*      <Col xs="12" md="6">*/}
      {/*        <div className="d-flex justify-content-center">*/}
      {/*          <img*/}
      {/*            src={require("../../assets/img/brand/SHAPEAI_logo.webp")}*/}
      {/*            alt="logo"*/}
      {/*            className="img-logo"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*      <Col xs="12" md="6">*/}
      {/*        <div className="">*/}
      {/*          <h2 className="display-3 text-white">Register to ShapeAI</h2>*/}
      {/*          <Alert color="danger" isOpen={serverError}>*/}
      {/*            <span className="alert-text">{serverError}</span>*/}
      {/*          </Alert>*/}
      {/*          <div className="auth__forms">*/}
      {/*            <form onSubmit={handleSubmit}>*/}
      {/*              <Row>*/}
      {/*                <Col>*/}
      {/*                  <Label className="text-gray font-weight-700">*/}
      {/*                    First Name*/}
      {/*                  </Label>*/}
      {/*                  <InputField*/}
      {/*                    className="custom_text_input"*/}
      {/*                    type="text"*/}
      {/*                    name="firstName"*/}
      {/*                    value={userCredentials.firstname}*/}
      {/*                    onChange={handleInputCredentials}*/}
      {/*                    required*/}
      {/*                  />*/}
      {/*                </Col>*/}
      {/*                <Col>*/}
      {/*                  <Label className="text-gray font-weight-700">*/}
      {/*                    Last Name*/}
      {/*                  </Label>*/}
      {/*                  <InputField*/}
      {/*                    className="custom_text_input"*/}
      {/*                    type="text"*/}
      {/*                    name="lastName"*/}
      {/*                    value={userCredentials.lastname}*/}
      {/*                    onChange={handleInputCredentials}*/}
      {/*                    required*/}
      {/*                  />*/}
      {/*                </Col>*/}
      {/*              </Row>*/}
      {/*              <Label className="text-gray font-weight-700">Email</Label>*/}
      {/*              <InputField*/}
      {/*                type="email"*/}
      {/*                name="email"*/}
      {/*                value={userCredentials.email}*/}
      {/*                onChange={handleInputCredentials}*/}
      {/*                required*/}
      {/*              />*/}
      {/*              <Label className="text-gray font-weight-700">*/}
      {/*                Password*/}
      {/*              </Label>*/}
      {/*              <InputField*/}
      {/*                type="password"*/}
      {/*                name="password"*/}
      {/*                value={userCredentials.password}*/}
      {/*                onChange={handleInputCredentials}*/}
      {/*                required*/}
      {/*              />*/}
      {/*              <Button type="submit" color="primary" block>*/}
      {/*                {reduxState.userReducer.loading ? (*/}
      {/*                  <Spinner size="sm" />*/}
      {/*                ) : (*/}
      {/*                  "Register"*/}
      {/*                )}*/}
      {/*              </Button>*/}
      {/*            </form>*/}
      {/*            <small className="mt-3 text-gray">*/}
      {/*              Already have an account?*/}
      {/*              <Link href="/auth/login">*/}
      {/*                <span className="ml-2 text-white account__exist">*/}
      {/*                  Log in*/}
      {/*                </span>*/}
      {/*              </Link>*/}
      {/*            </small>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </Col>*/}
      {/*    </Row>*/}
      {/*  </Container>*/}
      {/*</section>*/}
    <div/>
      </>
  );
};

export default Register;
