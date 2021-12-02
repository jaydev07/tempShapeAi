import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote, useIonRouter
} from "@ionic/react";

import { useLocation } from 'react-router-dom';
import {
  paperPlaneOutline, paperPlaneSharp, logOutSharp, logOutOutline, heartOutline, heartSharp,
  videocamOutline, videocamSharp, videocamOff, videocam,
} from 'ionicons/icons';
import './Menu.css';
import React, { useContext } from "react";

import { auth } from "../services/firebase";
import { UserContext } from "../context/user-context";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const mentorOnlyPages = ['Streams'];
const appPages: AppPage[] = [
  // {
  //   title: 'Inbox',
  //   url: '/page/Inbox',
  //   iosIcon: mailOutline,
  //   mdIcon: mailSharp
  // },
  {
    title: 'Messages',
    url: '/chats',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  },
  {
    title: 'Streams',
    url: '/mentor/streams',
    iosIcon: videocamOutline,
    mdIcon: videocamSharp,
  },
  // {
  //   title: 'Archived',
  //   url: '/page/Archived',
  //   iosIcon: archiveOutline,
  //   mdIcon: archiveSharp
  // },
  // {
  //   title: 'Trash',
  //   url: '/page/Trash',
  //   iosIcon: trashOutline,
  //   mdIcon: trashSharp
  // },
  // {
  //   title: 'Spam',
  //   url: '/page/Spam',
  //   iosIcon: warningOutline,
  //   mdIcon: warningSharp
  // }
];


const Menu: React.FC = () => {
  const location = useLocation();
  const router = useIonRouter();
  const user = useContext(UserContext);
  return (
    <IonMenu hidden={location.pathname === '/login' || location.pathname === '/register' || location.pathname.includes('class')} contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader><img alt={'logo'} src={'https://shapeai-uploads.s3.ap-south-1.amazonaws.com/logo.png'}/></IonListHeader>
          <IonNote>Welcome back {user?.displayName}!</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} hidden={mentorOnlyPages.includes(appPage.title) && !user?.isMentor} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
          <IonMenuToggle key={'logout'} autoHide={false}>
            <IonItem routerDirection="none" lines="none" onClick={() => auth().signOut().then(() => router.push('/login') )} detail={false}>
              <IonIcon slot="start" ios={logOutOutline} md={logOutSharp} />
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
        
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
