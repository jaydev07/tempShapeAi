import React,{useState,useContext} from 'react';

import {
	IonContent,
	IonRow,
	IonCol,
	useIonRouter,
} from "@ionic/react";

import "./DashboardSideBar.css";
import myJsonData from "../pages/Home/data.json";
import praCourse from "../pages/Home/PracticeData";

import { useLocation,NavLink,Link } from 'react-router-dom';

import { auth } from "../services/firebase";
import { UserContext } from "../context/user-context";
import { PracticeDataContext } from "../context/practiceData-context";
import { DashboardDataContext } from "../context/dashboardData-context";
import {ReactComponent as Locked} from "../Assets/Sidebar and Practice Section/Icon/Content Card/Locked.svg";
import {ReactComponent as Unlocked} from "../Assets/Sidebar and Practice Section/Icon/Content Card/Unlocked.svg";
import SideNavBar from './SideNavBar';
import Chats from "../pages/Chats";

const DashboardSideBar = () => {

	const practiceData = useContext(PracticeDataContext);
	const dashboardData = useContext(DashboardDataContext);

	const location = useLocation();
    const router = useIonRouter();
    const user = useContext(UserContext);

    const [searchInput,setSearchInput] = useState('');

    const handleInputChange = (e:any) => {
        let search=e.target.value;
        setSearchInput(search);
    }

    return(
        <div>
			<SideNavBar />
			
				{location.pathname === '/dashboard' && (

					<div className="main-div">
						<div className="side-heading-div">
							<h4 className="side-main-heading">Full Stack Web Dev Training and Internship Program</h4>
						</div>
						<input className="search-input" placeholder="Search" onChange={handleInputChange} value={searchInput}/>

						<div className="schedule">
							<h6>Schedule</h6>
							{
								dashboardData.data.map((data,index) => {
									let today = new Date();
									let date = today.getFullYear()+`-${today.getMonth()<10 ? '0':null}`+(today.getMonth()+1)+'-'+today.getDate();
									
									if(date>=data.days[0].sessions[0].date && date<=data.days[data.days.length-1].sessions[data.days[data.days.length-1].sessions.length-1].date){
						
										let session:any;
										let currentDayIndex:number=0;
										for(let i=0;i<data.days.length;i++){
											session = data.days[i].sessions.find((data:any) => data.date===date);
											if(session){
												currentDayIndex=i;
												break;
											}
										}
										
										return(
											<React.Fragment>
												<h4>Today, {dashboardData.data[index].days[currentDayIndex].day}</h4>
												{
													dashboardData.data[index].days[currentDayIndex].sessions.map((session:any,index:number) => {
														// if(index!=2){
															return(
																<IonRow className='topic-container'>
																	<IonCol className="card timings">
																		<p className="start-time">{session.startTime.substring(0,5)}</p>
																		<p className="end-time">{session.endTime.substring(0,5)}</p>
																	</IonCol>
																	<IonCol size="10" className={`card topic-info ${index%2==0 ? 'even':'odd'}`}>
																		<h4>{session.session.name}</h4>
																		{session.mentor && <p>By {session.mentor}</p>}
																	</IonCol>
																</IonRow>
															)
														// }
													})
												}
											</React.Fragment>
										)
									}
									else if(index==dashboardData.data.length-1){
										return(
											<React.Fragment>
												<div className="no-lec-div">
													<h4>No lectures for today</h4>
												</div>
											</React.Fragment>
										)
									}
								})

								// myCourse.map(week => {
								// 	let today = new Date();
								// 	let date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
								// 	if(date>=week.days[0].date && date<=week.days[week.days.length-1].date){
								// 		let todayIndex = week.days.findIndex(day => day.date===date);
								// 		return(
								// 			<React.Fragment>
								// 				<h4>Today, Day {todayIndex+1}</h4>
								// 				{
								// 					week.days[todayIndex].topics.map((topic,index) => {
								// 						if(index!=2){
								// 							return(
								// 								<IonRow className='topic-container'>
								// 									<IonCol className="card timings">
								// 										<p className="start-time">{topic.startTime}</p>
								// 										<p className="end-time">{topic.endTime}</p>
								// 									</IonCol>
								// 									<IonCol size="10" className={`card topic-info ${index%2==0 ? 'even':'odd'}`}>
								// 										<h4>{topic.title}</h4>
								// 										{topic.instructor && <p>By {topic.instructor}</p>}
								// 									</IonCol>
								// 								</IonRow>
								// 							)
								// 						}
								// 					})
								// 				}
								// 			</React.Fragment>
								// 		)
								// 	}	
								// })
							}	
						</div>
					</div>
				)}
				
				{location.pathname.includes('/practice') && (
					<div className="main-div">
						<div className="side-heading-div">
							<h4 className="side-main-heading">Full Stack Web Dev Training and Internship Program</h4>
						</div>
						<input className="search-input" placeholder="Search" onChange={handleInputChange} value={searchInput}/>

						<h6 className="links-heading">LINKS</h6>
						{
							practiceData.data.map((week,index) => {
								return(
									<div className="week-navlink">
										<Link to={`/practice/week/${index+1}`} className="week-links">
											{/* @ts-ignore */}
											{week.unlocked ? <Unlocked /> : <Locked />}
											<p className="week-text">Week{index+1}</p>
										</Link>
									</div>
								)
							})

							// practiceCourse.weeks.map((week,index) => {
							// 	return(
							// 		<div className="week-navlink">
							// 			<Link to={`/practice/week/${index+1}`} className="week-links">

							// 				{/* {week.viewed ? <i className="fas fa-lock-open"></i>:<i className="fas fa-lock"></i>} */}
							// 				{week.viewed ? <Unlocked /> : <Locked />}
							// 				<p className="week-text">Week{index+1}</p>
							// 			</Link>
							// 		</div>
							// 	)
							// })
						}
					</div>
				)}

				{location.pathname === '/support' && (
					<Chats />
				)}
		</div>
    )
}

export default DashboardSideBar;