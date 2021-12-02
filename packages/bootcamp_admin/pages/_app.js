import React from "react";
import ReactDOM from "react-dom";
import Head from "next/head";
import Router, {useRouter} from "next/router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { useSelector } from 'react-redux';
// Components
import PageChange from "components/PageChange/PageChange.js";
import Navbar from "components/Navbars/AdminNavbar";

// Redux Store
import { store, persistor } from "../redux/store";

// plugins styles from node_modules
import "@fortawesome/fontawesome-free/css/all.min.css";

// plugins styles downloaded
import "assets/vendor/nucleo/css/nucleo.css";
import "react-toastify/dist/ReactToastify.css";

// core styles
import "assets/scss/nextjs-argon-dashboard-pro.scss?v1.1.0";

import { ApolloProvider } from "@apollo/client";
import client from "../configs/ApolloClient.config";
import {getCurrentUserAction} from '../redux/reducers/user/user.action';
import graphQlClient from '../configs/ApolloClient.config';
import {GET_CURRENT_USER_QUERY} from '../gql/users';

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

const App = ({ Component, pageProps }) => {
  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const userState = store.getState().user;
  const router = useRouter();
  const checkAuth = async () => {
    if (!userState._id) {
      if (!localStorage.userToken || localStorage.userToken === 'null') router.push('/login')
      else {
      const { data } = await graphQlClient.query({
          query: GET_CURRENT_USER_QUERY,
        });
        store.dispatch({
          type: 'LOGIN',
          payload: {
            token: localStorage.userToken,
            user: data.getCurrentUser,
          },
        });
      }
    }
  }
  React.useEffect(() => {
    checkAuth();
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
      <Provider store={store}>
        <ApolloProvider client={client}>
          <PersistGate persistor={persistor}>
            <Navbar />
            <Layout>
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
            </Layout>
          </PersistGate>
        </ApolloProvider>
      </Provider>
    </React.Fragment>
  );
};

export default App;
