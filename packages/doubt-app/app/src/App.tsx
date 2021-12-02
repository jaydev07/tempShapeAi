import { IonApp, IonRouterOutlet, IonSplitPane, IonMenu,useIonRouter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useHistory, useLocation } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
import Main from './Main';
// @ts-ignore
import  "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import './global.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import React,{useContext,useEffect,useState} from "react";
import Auth from "./pages/Login";
import Chat from './components/Chat';
import Chats from "./pages/Chats";
import {UserContext} from "./context/user-context";
import Streams from "./pages/Streams";
import Live from "./pages/Classes/Live";

import Dashboard from "./pages/Home/Dashboard";
import MyPrograms from "./pages/Home/MyPrograms";
import MentorSideBar from "./components/MentorSideBar";
import DashboardSideBar from "./components/DashboardSideBar";
import Practice from "./pages/Home/Practice";
import ProblemSet from "./pages/Home/ProblemSet";
import QuestionPage from "./pages/Home/QuestionPage";
import ZoomConnect from "./pages/ZoomConnect";
import {auth, db} from "./services/firebase";
import { User } from './context/user-context';

import LoginW from './controllers/OnBoarding';
const App: React.FC = () => {

  const router = useIonRouter();
  const [user,setUser] = useState<User | null>(null);

  useEffect(() => {
    // @ts-ignore
    auth().onAuthStateChanged(user => {
      if (!user) {
        setUser(null);
      } else
        // @ts-ignore
      db.ref().child("users").child(user.uid).get().then((snapshot) => {
        if (snapshot.exists()) {
          const userDoc = snapshot.val();
          // console.log('hi', userDoc)
          // @ts-ignore
          auth().currentUser?.getIdTokenResult().then(idTokenResult => {
            setUser({
              ...user,
              isMentor: Boolean(idTokenResult.claims.mentor),
              ...userDoc
            });
          })
          }
        } )
    })  
  }, []);


  return (
    <IonApp>
      <IonReactRouter>
        <Main>
        <IonSplitPane contentId="main" style={{}}>
          {/* {
            (user && (user.uid !== '' || user.isMentor)) ? (
              <IonMenu>
                <DashboardSideBar />
              </IonMenu>
            ):null
          } */}

          <IonMenu>
            <DashboardSideBar />
            {/* <MentorSideBar /> */}
          </IonMenu>

          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <LoginW />
            </Route>
            <Route path="/page/:name" exact={true}>
              <Page />
            </Route>
            <Route path="/login" exact={true}>
              <Auth type={'Login'} />
            </Route>

            <Route path="/mentor/streams" exact={true} >
              <Streams />
            </Route>
            <Route path="/chats" exact={true}>
              <Chats />
            </Route>
	          <Route path="/class/live/:id" exact={true}>
		          <Live />
	          </Route>
            <Route path={'/login/bleh'} exact={true}>
            </Route>
            
            <Route path="/register" exact={true}>
              <Auth type={'Register'} />
            </Route>

            <Route path="/dashboard" exact={true}> 
              <Dashboard />
            </Route>

            <Route path="/programs" exact={true}> 
              <MyPrograms />
            </Route>

            <Route path="/practice/week/:weekId" exact={true}> 
              <Practice />
            </Route>

            <Route path="/practice/set/:setId/week/:weekId" exact={true}>  
              <ProblemSet />
            </Route>
            
            <Route path="/practice/question/:quesId/set/:setId/week/:weekId" exact={true}>  
              <QuestionPage />
            </Route>
            <Route path='/auth/zoom' exact={true}>
              <ZoomConnect />
            </Route>

          </IonRouterOutlet>
        </IonSplitPane>
        </Main>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
