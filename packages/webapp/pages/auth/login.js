import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Container, Row, Col, Spinner, Alert } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

// Layout
import AuthLayout from "../../layouts/Auth";

// Components
import InputField from "../../components/FormFields/InputField";

// Redux actions
import {getCurrentUserStatus, loginUserAction} from "../../Redux/reducer/user/user.action";

// Styles
import "../../assets/css/register.css";

const Login = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [serverError, setServerError] = useState("");
  const [blocking, setBlocking] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const reduxState = useSelector(({ userReducer, errorReducer }) => ({
    userReducer,
    errorReducer,
  }));

  useEffect(() => {
    setBlocking(false);
    setServerError(reduxState.errorReducer.error)
  }, [
    reduxState.errorReducer,
  ]);

  const handleInputCredentials = (e) => {
    clearError();
    setBlocking(false);
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value});
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call redux action
    setBlocking(true);
    const { payload } = await dispatch(loginUserAction(userCredentials));
    setBlocking(false);
    if (payload.user && !payload.user.isVerified) router.push('/auth/pending-verification');
    else if (payload.token) {
      const statusRes = await dispatch(getCurrentUserStatus());
      if (!statusRes.payload.hasSubmittedInitForm) router.push('/student/form');
      else router.push('/student/dashboard');
    }
    setBlocking(false);
  };

  const clearError = () => setServerError("");

  return (
    <>
      <Head>
        <title>ShapeAI - Login</title>
      </Head>
      <section>
        <div className="w-row">
          <div className="column-6 w-col w-col-5">
            <div className="container-11 w-container">
              <img
                src="https://uploads-ssl.webflow.com/604cac9b9d1aac837756f953/6060617e59cb0e6801f2223f_image%201.png"
                loading="lazy" width="175" alt="" className="image-24"/>
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
            <div className="div-block-39">
              <h1 className="heading-18">Log In</h1>
              <img
                src="https://uploads-ssl.webflow.com/604cac9b9d1aac837756f953/606173d072911446c73b2838_5f519cbbddf17ed24dc2539f_Group%201.png"
                loading="lazy" width="356" alt="" className="image-23"/>
              <p className="paragraph-2"><strong className="bold-text-11">Join these and 5000+ other Developers</strong>
              </p>
              <div className="sign-in-input">
                <div className="w-form">
                  <form onSubmit={handleSubmit} className="form">
                    <Alert color="danger" isOpen={serverError}>
                      <span className="alert-text">{serverError}</span>
                    </Alert>
                    <input type="email"
                      className="text-field w-input"
                      maxLength="256"
                      name="email"
                      data-name="Email"
                      placeholder="Enter Your Email"
                      id="email"
                      value={userCredentials.email}
                      onChange={handleInputCredentials}
                      required=""/>
                    <input
                      type="password"
                      className="text-field w-input"
                      maxLength="256"
                      name="password"
                      placeholder="Password"
                      required=""
                      value={userCredentials.password}
                      onChange={handleInputCredentials}
                    />
                    <Button type="submit" value="Sign in"
                            color={'primary'}
                            disabled={blocking}
                            className="submit-button-3 w-button" >
                      {blocking ? 'Please Wait...' : 'Sign In'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
            <div className="text-block-6">New To Shape AI?
              <Link href={'/auth/register'}><span style={{ cursor: 'pointer' }} className="text-span-2"><strong
              className="bold-text-12">Sign Up</strong></span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
