import React,{useState,useContext} from 'react';
import {
    IonPage,
    IonContent,
    IonHeader,
    IonGrid,
    IonRow,
    IonCol    
} from "@ionic/react";

import { DashboardDataContext } from "../../context/dashboardData-context";
import myJsonData from "./data.json";
import "./Dashboard.css";
import {ReactComponent as Active} from "../../Assets/Sidebar and Practice Section/Icon/Week/Active.svg";
import {ReactComponent as Completed} from "../../Assets/Sidebar and Practice Section/Icon/Week/Completed.svg";
import {ReactComponent as NotActive} from "../../Assets/Sidebar and Practice Section/Icon/Week/Not Active.svg";

const Dashboard = () => {

    const dashboardData = useContext(DashboardDataContext);

    return(
        <IonPage>
        
            <IonHeader className="heading-div">
                <h1 className="heading">Full Stack Web Dev Training and</h1>
                <br />
                <h1 className="heading">Internship Program</h1> 
            </IonHeader>

            <IonContent>
                <div className='week-symbole-section'>
                {
                    dashboardData.data.map((data,index) => {
                        let myClass;
                        let today = new Date();
                        let date = today.getFullYear()+`-${today.getMonth()<10 ? '0':null}`+(today.getMonth()+1)+'-'+today.getDate();
                        if(date<data.days[0].sessions[0].date){
                            myClass='upcoming';
                        }
                        else if(date>data.days[data.days.length-1].sessions[data.days[data.days.length-1].sessions.length-1].date){
                            myClass='completed';
                        }
                        else if(date>=data.days[0].sessions[0].date && date<=data.days[data.days.length-1].sessions[data.days[data.days.length-1].sessions.length-1].date){
                            myClass='live';
                        }
                        return (
                            <React.Fragment>
                                <div className='week-symbole'>
                                    {/* {myClass=='completed' && <i className="fas fa-check-circle icons tick"></i>}
                                    {myClass=='live' && <i className="fab fa-gg-circle icons current"></i>}
                                    {myClass=='upcoming' && <i className="fas fa-bullseye icons upcoming-symbole"></i>} */}

                                    {myClass=='completed' && <Completed />}
                                    {myClass=='upcoming' && <NotActive />}
                                    {myClass=='live' && <Active />}
                                    <p key={index}>{data.week}</p>  
                                </div>
                                <span><hr className='line'/></span>
                                {index==dashboardData.data.length-1 && <i className="fas fa-trophy trophy-icon"></i>}
                            </React.Fragment>
                        )
                    })
                }
                </div>

                <IonGrid className="weeks-div">
                    {
                        dashboardData.data.map((data:any) => {
                            return(
                                <IonRow className="weeks">
                                    <IonCol className="week">
                                        <h2>{data.week}</h2>
                                    </IonCol>
                                    <IonCol size="10" className="days">
                                        {
                                            data.days.map((data:any) => {
                                                return(
                                                    <IonRow className="day">
                                                        <IonCol className="day-number">
                                                            <h4>{data.day}</h4>
                                                        </IonCol>
                                                        <IonCol size="11" className="cards-div">
                                                            <IonRow className="day-row"> 
                                                                {
                                                                    data.sessions.map((session:any,index:number) => {
                                                                        let myClass='upcoming';
                                                                        let today = new Date();
                                                                        let date = today.getFullYear()+`-${today.getMonth()<10 ? '0':null}`+(today.getMonth()+1)+'-'+today.getDate();
                                                                        
                                                                        if(date>session.date){
                                                                            myClass='completed';
                                                                        }
                                                                        else if(date<session.date){
                                                                            myClass='upcoming';
                                                                        }
                                                                        else{
                                                                            let time = today.getHours() + ":" + today.getMinutes()+ ":" + today.getSeconds();
                                                                            if(session.endTime && time>session.endTime){
                                                                                myClass='completed';
                                                                            }
                                                                            else if(session.startTime && time<session.startTime){
                                                                                myClass='upcoming';
                                                                            }
                                                                            else if(session.startTime && time>=session.startTime && time<=session.endTime){
                                                                                myClass='live';
                                                                            }
                                                                        }
                                                                        let sessionDateInString = new Date(session.date).toString().split(' ')[0];
                                                                        return(
                                                                            <IonCol size="4" className={`cards ${myClass}`}>
                                                                                {/* <h6>{session.session.name} ({session.session.type})</h6> */}
                                                                                {/* {myClass=='live' && <p style={{color:"red"}}>Now Live</p>}
                                                                                {myClass=='upcoming' && <p>On {sessionDateInString}day, <br/>{session.date}, {session.startTime.substring(0,5)}</p>}
                                                                                {myClass=='completed' && <p>Ended on {sessionDateInString}day, <br/>{session.date}, {session.endTime.substring(0,5)}</p>} */}
                                                                                
                                                                                <h6>Welcome to the course</h6>
                                                                                <p>Ended on 9 Oct, 10:00AM</p>
                                                                                {/* {session.host && <p>{session.mentor}</p>} */}
                                                                                <p>Shaurya Sinha</p>
                                                                            </IonCol>
                                                                        )
                                                                    })
                                                                }
                                                            </IonRow>
                                                        </IonCol>
                                                    </IonRow>
                                                )
                                            })
                                        }
                                    </IonCol>
                                </IonRow>
                            )
                        })
                    }
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default Dashboard;