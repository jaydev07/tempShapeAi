import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Head from "next/head";
import Router from "next/router";
import { ApolloProvider } from "@apollo/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter } from "next/router";
import { SkeletonTheme } from "react-loading-skeleton";
import { ToastContainer } from "react-toastify";

// Libs
import apolloClient from "../config/ApolloClient.config";
import PageChange from "components/PageChange/PageChange.js";

// Custom Hook
import useUser from "../hooks/useUser";

// Redux Store
import { store, persistor } from "../Redux/store";

// plugins styles from node_modules
import "react-notification-alert/dist/animate.css";
import "@fullcalendar/common/main.min.css";
import "@fullcalendar/daygrid/main.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "select2/dist/css/select2.min.css";
import "quill/dist/quill.core.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

// plugins styles downloaded
import "assets/vendor/nucleo/css/nucleo.css";
// core styles
import "assets/scss/nextjs-argon-dashboard-pro.scss?v1.1.0";

Router.events.on("routeChangeStart", (url) => {
  document.body.classList.add("body-page-transition");
  ReactDOM.render(
    <PageChange path={url} />,
    document.getElementById("page-transition")
  );
});
Router.events.on("routeChangeComplete", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});
Router.events.on("routeChangeError", () => {
  ReactDOM.unmountComponentAtNode(document.getElementById("page-transition"));
  document.body.classList.remove("body-page-transition");
});

const App = ({ Component, pageProps, auth }) => {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  const router = useRouter();

  useEffect(() => {
    if (!localStorage.userToken) {
      router.push("/auth/login/");
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>ShapeAI</title>
      </Head>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <Layout>
              <SkeletonTheme color="#dadde3">
                <ToastContainer
                  position="bottom-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
                <Component {...pageProps} />
              </SkeletonTheme>
            </Layout>
          </PersistGate>
        </Provider>
      </ApolloProvider>
    </React.Fragment>
  );
};

export default App;
