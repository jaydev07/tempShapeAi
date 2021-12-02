import React,{useState,useEffect,useContext} from 'react';
import {useParams, Link} from "react-router-dom";

import {
    IonPage,
    IonContent,
    IonHeader,
    IonGrid,
    IonRow,
    IonCol    
} from "@ionic/react";

import course from "./PracticeData";
import "./Practice.css";
import {PracticeDataContext} from "../../context/practiceData-context";

import {ReactComponent as Locked} from "../../Assets/Sidebar and Practice Section/Icon/Content Card/Locked.svg";
import {ReactComponent as Unlocked} from "../../Assets/Sidebar and Practice Section/Icon/Content Card/Unlocked.svg";
import {ReactComponent as Completed} from "../../Assets/Sidebar and Practice Section/Icon/Content Card/Completed.svg";

const Practice = () => {

    const practice=useContext(PracticeDataContext);
    const {weekId} =useParams<{ weekId: string }>();

    const [myCourse,setCourse]=useState(course);

    let currentWeek=practice.data.findIndex((weekData:any) => weekData.week === weekId);

    return(
        <IonPage>
            <IonContent>
                <div className="practice-container">
                    <div className="video-set-container">
                        <h2 className="practice-heading">Practice with DSA Videos</h2>
                        <p >Learn from a collection of well curated courses by Industry Experts</p>
                        <IonRow>
                        {
                            myCourse.videoSet.map(videoSet => {
                                return(
                                    <IonCol size="3" className="set-card">
                                        {/* {videoSet.viewed ? <i className="fas fa-lock-open"></i>:<i className="fas fa-lock"></i>} */}
                                        {videoSet.viewed ? (
                                            <div className="unlock-div">
                                                <Unlocked className="unlock"/>
                                            </div>) : ( 
                                            <div className="lock-div">
                                                <Locked className="lock"/>
                                            </div>
                                        )}
                                        <h4>{videoSet.title}</h4>
                                        <p className="card-description">{videoSet.description}</p>
                                        <h5 className="videos-length">{videoSet.videos.length} Videos</h5>
                                    </IonCol>
                                )
                            })
                        }
                        </IonRow>
                    </div>

                    { practice.data.length>0 && (
                        <div className="practice-set-container">
                            <h2 className="practice-heading">Practice with Problems</h2>
                            <p>Learn from a collection of well curated courses by Industry Experts</p>
                            <IonRow>
                            {
                                practice.data[currentWeek].days.map((dayData:any,index:number) => {
                                    return(
                                        <IonCol size="3" className="set-card">
                                            { dayData.unlocked ? (
                                                <Link to={`/practice/set/${dayData.day}/week/${weekId}`} className='week-card-link'>
                                                    <div className="unlock-div">
                                                        <Unlocked className="unlock"/>
                                                    </div>
                                                    <h4>Competative Programming Question Set {index+1}</h4>
                                                    <p className="card-description">{dayData.description}</p>
                                                    <h5 className="problems-length">{dayData.problems.length} Questions</h5>
                                                </Link>
                                             ):(
                                                <div className='week-card-link'>
                                                    <div className="lock-div">
                                                        <Locked className="lock"/>
                                                    </div>
                                                    <h4>Competative Programming Question Set {index+1}</h4>
                                                    <p className="card-description">{dayData.description}</p>
                                                    <h5 className="problems-length">{dayData.problems.length} Questions</h5>
                                                </div>
                                            )} 
                                        </IonCol>
                                    )
                                })
                                
                                // myCourse.weeks[Number(weekId)-1].problemSet.map((problemSet,index) => {
                                //     return(
                                //         <IonCol size="3" className="set-card">
                                //             { problemSet.viewed ? (
                                //                 <Link to={`/practice/set/${index+1}/week/${weekId}`} className='week-card-link'>
                                //                     <div className="unlock-div">
                                //                         <Unlocked className="unlock"/>
                                //                     </div>
                                //                     <h4>{problemSet.title}</h4>
                                //                     <p className="card-description">{problemSet.description}</p>
                                //                     <h5 className="problems-length">{problemSet.questions.length} Questions</h5>
                                //                 </Link>
                                //             ):(
                                //                 <div className='week-card-link'>
                                //                     <div className="lock-div">
                                //                         <Locked className="lock"/>
                                //                     </div>
                                //                     <h4>{problemSet.title}</h4>
                                //                     <p className="card-description">{problemSet.description}</p>
                                //                     <h5 className="problems-length">{problemSet.questions.length} Questions</h5>
                                //                 </div>
                                //             )}
                                //         </IonCol>
                                //     )
                                // })
                            }
                            </IonRow>
                        </div>        
                    )}
                </div>  
            </IonContent>
        </IonPage>
    )
}

export default Practice;