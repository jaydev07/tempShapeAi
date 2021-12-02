import React, { useEffect, useState, useRef } from "react";
import {
  IonInput,
  IonLabel,
  IonHeader,
  IonContent,
  IonTitle,
  IonItem,
  IonItemDivider,
  IonPage,
  IonToolbar,
  IonMenuButton,
  IonButton,
  useIonAlert,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import { Link } from "react-router-dom";
import { useIonRouter } from "@ionic/react";
import { auth } from "../services/firebase";
import { createQAPortalUser } from "../api/auth";

import "./Login.css";

const FormInput: React.FC<{
  name: string;
  label: string;
  onChange: (e: any) => void;
  type: any;
  value: string;
}> = ({ name, label, onChange, type, value }) => {
  return (
    <>
      <div className="input-element">
        <label htmlFor="name-4" className="af-class-field-label-2 label-element">
          {label}
        </label>
        <IonInput
          required={true}
          value={value}
          // @ts-ignore
          type={type}
          // className="af-class-text-field w-input"
          className="input-tag"
          onIonChange={onChange}
          name={name}
          id={name}
        />
      </div>
    </>
  );
};
const Auth: React.FC<{ type: string }> = ({ type }) => {
  const router = useIonRouter();
  const [userInputs, setUserInput] = useState({
    email: "",
    password: "",
    name: "",
    paymentId: "",
  });
  const [present] = useIonAlert();
  const showError = (err: string) =>
    present({
      cssClass: "alert-error",
      header: "Error",
      message: err.replace("Error:", ""),
      buttons: ["Ok"],
    });
  const handleInputChange = (e: any) => {
    const temp = { ...userInputs };
    // @ts-ignore
    temp[e.target.name] = e.target.value;
    setUserInput(temp);
  };
  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) router.push("/chats");
    });
  }, []);

  const submitHandler = async (e: any) => {
    console.log("ss", userInputs);
    e.preventDefault();
    if (type === "Register") {
      try {
        console.log("jj");
        const registerRes = await createQAPortalUser(userInputs);
        console.log({ registerRes });
        await auth().signInWithCustomToken(registerRes.data.token);
        router.push("/chats");
      } catch (e) {
        showError(e.response.data);
      }
    } else {
      try {
        await auth().signInWithEmailAndPassword(
          userInputs.email,
          userInputs.password
        );
        router.push("/chats");
      } catch (e) {
        showError(e.message);
      }
    }
  };
  

  return (
    <>
      <IonPage>
        <IonContent fullscreen>
          <div className="ionContent-container">
            <div className="auth-container">
              <span>
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
            @import url(/css/normalize.css);
            @import url(/css/webflow.css);
            @import url(/css/shape-ai-chat-platform.webflow.css);
          `,
                  }}
                />
                <span className="">
                  <div className="">
                    <div className="login-heading-div">
                      <h1 className="">
                        {type === "Register"
                          ? "Let's get Started"
                          : "Welcome back"}
                      </h1>
                    </div>
                    <form onSubmit={submitHandler}>
                      <div className="login-sub-heading-div">
                        {type === "Register"
                          ? "Complete the form to get started"
                          : "Log In to continue"}
                      </div>
                      <div className="">
                        <div className="w-form">
                          {type === "Register" && (
                            <>
                              <FormInput
                                name={"name"}
                                label={"Name"}
                                onChange={handleInputChange}
                                type={"text"}
                                value={userInputs.name}
                              />
                              <FormInput
                                name={"paymentId"}
                                label={"Payment Id"}
                                onChange={handleInputChange}
                                type={"text"}
                                value={userInputs.paymentId}
                              />
                            </>
                          )}
                          <FormInput
                            onChange={handleInputChange}
                            name={"email"}
                            value={userInputs.email}
                            type={"email"}
                            label={"Email Address"}
                          />

                          <FormInput
                            onChange={handleInputChange}
                            name={"password"}
                            value={userInputs.password}
                            type={"password"}
                            label={"Password"}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="">
                          <IonButton
                            expand={"block"}
                            color={"primary"}
                            type={"submit"}
                          >
                            {type}
                          </IonButton>
                          <div className="">
                            {/*<div className="af-class-text-block-5 af-class-forgot"><em>Forgot Password?</em>*/}
                            {/*  <a href="#" className="af-class-link" />*/}
                            {/*</div>*/}
                          </div>
                          <div className="">
                            {type === "Login" ? (
                              <>
                                <div className="switch-div">
                                  Not Yet Registered?{" "}
                                  <Link to={"/register"} className="switch-link">Signup</Link>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="switch-div">
                                  Have an account?{" "}
                                  <Link to={"/login"} className="switch-link">Login</Link>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </span>
              </span>
            </div>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Auth;
