import {
    IonContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonMenu,
    IonMenuToggle,
    IonNote, useIonRouter,
    IonPage
  } from "@ionic/react";

import { useLocation,NavLink } from 'react-router-dom';
import React, { useContext,useState, useEffect } from "react";

import { auth } from "../services/firebase";
import { UserContext } from "../context/user-context";

import "./SideNavBar.css";
import {ReactComponent as Dashboard} from "../Assets/Sidebar and Practice Section/Icon/Dashboard.svg";
import {ReactComponent as Practice} from "../Assets/Sidebar and Practice Section/Icon/Practice.svg";
import {ReactComponent as Support} from "../Assets/Sidebar and Practice Section/Icon/Support.svg";
import {ReactComponent as Settings} from "../Assets/Sidebar and Practice Section/Icon/Settings.svg";
import {ReactComponent as LogOut} from "../Assets/Sidebar and Practice Section/Icon/Log Out.svg";
import {ReactComponent as LiveTraining} from "../Assets/Sidebar and Practice Section/Icon/LiveTraining.svg";
import {ReactComponent as Help} from "../Assets/Sidebar and Practice Section/Icon/Help.svg";
import {ReactComponent as Explore} from "../Assets/Sidebar and Practice Section/Icon/Explore.svg";
import {ReactComponent as Course} from "../Assets/Sidebar and Practice Section/Icon/Course.svg";
import {ReactComponent as MyPrograms} from "../Assets/Sidebar and Practice Section/Icon/MyPrograms.svg";

  
  const SideNavBar: React.FC = () => {
    const location = useLocation();
    const router = useIonRouter();
    const user = useContext(UserContext);
    const [navbarConfig, setConfig] = useState<any []>([]);

    interface AppPage {
      title: string;
      url: string;
      icon:any;
    }

    // For student
    const studentNavbarConfig: AppPage[] = [
      {
        title: 'Live Training',
        url: '/dashboard',
        icon: <LiveTraining />
      },
      {
        title: 'Course',
        url: '/course',
        icon: <Course />
      },
      {
        title: 'My Programs',
        url: '/programs',
        icon: <MyPrograms />
      },
      {
        title: 'Explore',
        url: '/explore',
        icon: <Explore />
      },
      {
        title: 'Practice',
        url: '/practice/week/1',
        icon: <Practice />
      },
      {
        title: 'Help',
        url: '/help',
        icon: <Help />
      },
      {
        title: 'Settings',
        url: '/settings',
        icon: <Settings />
      }
    ];

    const mentorNavbarConfig: AppPage[] = [
      {
        title: 'Dashboard',
        url: '/mentor/streams',
        icon: <Dashboard />
      }, 
      {
        title: 'Messages',
        url: '/chat',
        icon: <Support />
      }
    // }, {
    //   path: '/settings',
    //   label: 'Settings',
    //   iconClassName: 'fas fa-cog',
    // }
    ];

    // useEffect(() => {
    //   console.log({user})
    //   if (user && "isMentor" in user) {
    //     if (!user.isMentor) setConfig(studentNavbarConfig);
    //     else setConfig(mentorNavbarConfig);
    //   }
    // }, [user]);

    return ( 
      <div className="navbar-container">
        <i className="far fa-dot-circle main-logo"></i>

        { 
            studentNavbarConfig.map(page => {
              return(
                <li className={`link-item ${location.pathname === page.url ? 'selected' : ''} ${page.title==='Help' && 'help-link'}`}>
                  <NavLink to={page.url} className={`nav-link`}>
                    <p className="nav-icons">{page.icon}</p>
                    <p className="nav-title">{page.title}</p>
                  </NavLink>
                </li>              
              )
            })
        }

        <li>
          <LogOut />
          <button className="logout-btn" onClick={() => auth().signOut().then(() => router.push('/login') )}>
            <p className="nav-title">Logout</p>
          </button>
        </li>
      </div>
    );
  };
  
  export default SideNavBar;