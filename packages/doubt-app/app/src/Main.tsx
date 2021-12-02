import React, { useEffect, useState } from 'react';
import {auth, db} from "./services/firebase";
import { useIonRouter} from "@ionic/react";
import { UserContext } from "./context/user-context";
import { User } from './context/user-context';
import dataPractice from "./pages/Home/dataPractice.json";
import myJsonData from "./pages/Home/data.json";
import {PracticeDataContext} from "./context/practiceData-context";
import {DashboardDataContext} from "./context/dashboardData-context";
import {UserProblemsContext} from "./context/userProblems-context";
import {getStudentBatch} from "./api/stream";
import {getUserProblems} from "./api/stream";

const MainContainer: React.FC = ({ children }) => {

	const router = useIonRouter();
	const [user, setUser] = useState<User | null>(null);
    const [completedProblems,setCompletedProblems] = useState<Array<string>>([]);

    // Dashboard
    interface finalDashboardDataInterface{
        week:string;
        days:Array<any>;
    }

	// Practice Data 
	interface finalDataInterface{
        week:string;
        weekId:string;
        unlocked:boolean;
        days:Array<any>;
    }

    // Practice
	const [myData,setMyData]=useState(dataPractice);
	const [finalData, setFinalData]=useState<finalDataInterface[]>([]);

    // Dashboard
    const [myDashboardData,setMyDashboardData]=useState(myJsonData);
    const [finalDashboardData, setFinalDashboardData]=useState<finalDashboardDataInterface[]>([]);

    // Functions of Practice
    const compareDayFunction = (a:any,b:any) => {
        let aDay=Number(a.day.name.split(' ')[1]);
        let bDay=Number(b.day.name.split(' ')[1]);
        if (aDay<bDay) {
            return -1;
          }
        else if (aDay>bDay) {
        return 1;
        }
        return 0;
    }

    const compareWeekFunction = (a:any,b:any) => {
        let aWeek=Number(a.week.name.split(' ')[1]);
        let bWeek=Number(b.week.name.split(' ')[1]);
        if (aWeek<bWeek) {
            return -1;
          }
        else if (aWeek>bWeek) {
        return 1;
        }
        return 0;
    }

    myData.sort(compareDayFunction);
    myData.sort(compareWeekFunction);

    //////////////////////////////////////////////// Dashboard data ///////////////////////////////////////////

    const compareDashboardDayFunction = (a:any,b:any) => {
        let aDay=Number(a.day.name.split(' ')[1]);
        let bDay=Number(b.day.name.split(' ')[1]);
        if (aDay<bDay) {
            return -1;
          }
        else if (aDay>bDay) {
        return 1;
        }
        return 0;
    }

    const compareDashboardWeekFunction = (a:any,b:any) => {
        let aWeek=Number(a.week.name.split(' ')[1]);
        let bWeek=Number(b.week.name.split(' ')[1]);
        if (aWeek<bWeek) {
            return -1;
          }
        else if (aWeek>bWeek) {
        return 1;
        }
        return 0;
    }

    myDashboardData.sessions.sort(compareDashboardDayFunction);
    myDashboardData.sessions.sort(compareDashboardWeekFunction);

    let myDashboardDataInWeeks=new Map<string,any>();
    myDashboardData.sessions.forEach((session,index) => {

        let startTime=session.startsAt.split('T')[1].split('.')[0];
        let endTime=String(Number(startTime.split(':')[0])+3)+startTime.substring(2,startTime.length);
        // @ts-ignore
        let mentor:string=myDashboardData.mentors[session.host];

        if(index==0){
            myDashboardDataInWeeks.set(session.week.name,[{
                ...session,
                date:session.startsAt.split('T')[0],
                startTime:startTime,
                endTime:endTime,
                mentor:mentor
            }]);
        }
        else{
            if(myDashboardDataInWeeks.get(session.week.name)){
                let currentWeek = myDashboardDataInWeeks.get(session.week.name);
                currentWeek.push({
                    ...session,
                    date:session.startsAt.split('T')[0],
                    startTime:startTime,
                    endTime:endTime,
                    mentor:mentor
                });
                myDashboardDataInWeeks.set(session.week.name,currentWeek);
            }
            else{
                myDashboardDataInWeeks.set(session.week.name,[{
                    ...session,
                    date:session.startsAt.split('T')[0],
                    startTime:startTime,
                    endTime:endTime,
                    mentor:mentor
                }]);
            }
        }
    });

    let myDashboardDataFinal:Array<any> =[];
    myDashboardDataInWeeks.forEach((value,key) => {
        let days=new Map<string,any>();
        value.forEach((session:any,index:number) => {
            if(index==0){
                days.set(session.day.name,[session]);
            }
            else{
                if(days.get(session.day.name)){
                    let currentDay = days.get(session.day.name);
                    currentDay.push(session);
                    days.set(session.day.name,currentDay);
                }
                else{
                    days.set(session.day.name,[session]);
                }
            }
        });
        let daysArray:Array<any>=[];
        days.forEach((sessions:any,day:string) => {
            daysArray.push({day:day,sessions:sessions});
        })
        myDashboardDataFinal.push({week:key,days:daysArray});
    });

    useEffect(() => {
        // setFinalData([...myDataFinal]);
        setFinalDashboardData([...myDashboardDataFinal]);
    },[]);

    //////////////////// For UserProblems ////////////////////////////////
    useEffect(() => {
        const sendRequest = async () => {
            try{
                // setIsLoading(true);
                const response = await getUserProblems(user!.uid);
                setCompletedProblems([...response.data.userFound.problemIds]);
                // console.log(response.data.userFound.problemIds);
            }catch(err){
                console.log(err);
            }
            // setIsLoading(false);
        }
        if(user && user.uid){
            sendRequest();
        }
    },[router.routeInfo.pathname]);
	
    /////////////////// For Batches /////////////////////////
    const [batchStartDate, setBatchStartDate] = useState("08/05/2021");
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if(user && user.uid && batchStartDate && !completed){
            
            let startDate = new Date(batchStartDate);
            const d = new Date();
            let dd = String(d.getDate()).padStart(2, '0');
            let mm = String(d.getMonth() + 1).padStart(2, '0');
            let yyyy = d.getFullYear();
            let date = mm + '/' + dd + '/' + yyyy;
            let currentDate = new Date(date);
              
            let Difference_In_Time = currentDate.getTime() - startDate.getTime();
              
            let daysCompleted = Difference_In_Time / (1000 * 3600 * 24);
            let weeksCompleted = daysCompleted/7;

            let myDataInWeeks=new Map<string,any>();
            myData.forEach((problem,index) => {
                let unlocked;
                if(index==0){
                    if(weeksCompleted>=0){
                        unlocked = true;
                        weeksCompleted--;
                    }else{
                        unlocked = false;
                    }
                    myDataInWeeks.set(problem.week.name.split(' ')[1],{
                        weekId:problem.week._id,
                        unlocked:unlocked,
                        problems:[problem]
                    });
                }
                else{
                    if(myDataInWeeks.get(problem.week.name.split(' ')[1])){
                        let currentWeek = myDataInWeeks.get(problem.week.name.split(' ')[1]);
                        currentWeek.problems.push(problem);
                        myDataInWeeks.set(problem.week.name.split(' ')[1],currentWeek);
                    }
                    else{
                        if(weeksCompleted>=0){
                            unlocked = true;
                            weeksCompleted--;
                        }else{
                            unlocked = false;
                        }
                        myDataInWeeks.set(problem.week.name.split(' ')[1],{
                            weekId:problem.week._id,
                            unlocked:unlocked,
                            problems:[problem]
                        });
                    }
                }
            });

            let myDataFinal:Array<any> =[];
            myDataInWeeks.forEach((value,key) => {
                let days=new Map<string,any>();
                value.problems.forEach((problem:any,index:number) => {
                    let unlocked;
                    if(index==0){
                        if(daysCompleted>0){
                            unlocked = true;
                            daysCompleted--;
                        }else{
                            unlocked = false;
                        }
                        days.set(problem.day.name.split(' ')[1],{dayId:problem.day._id, unlocked:unlocked, description:problem.day.description , problems:[problem]});
                    }
                    else{
                        if(days.get(problem.day.name.split(' ')[1])){
                            let currentDay = days.get(problem.day.name.split(' ')[1]);
                            currentDay.problems.push(problem);
                            days.set(problem.day.name.split(' ')[1],currentDay);
                        }
                        else{
                            if(daysCompleted>0){
                                unlocked = true;
                                daysCompleted--;
                            }else{
                                unlocked = false;
                            }
                            days.set(problem.day.name.split(' ')[1],{dayId:problem.day._id, unlocked:unlocked, description:problem.day.description, problems:[problem]});
                        }
                    }
                });
                let daysArray:Array<any>=[];
                days.forEach((problems:any,day:string) => {
                    daysArray.push({day:day,dayId:problems.dayId, unlocked:problems.unlocked , description:problems.description, problems:problems.problems});
                })
                myDataFinal.push({week:key, weekId:value.weekId, unlocked:value.unlocked, days:daysArray});
            });

            setFinalData([...myDataFinal]);
            console.log(myDataFinal);
            setCompleted(true);
        }
    },[router.routeInfo.pathname, batchStartDate]);

	// User
	useEffect(() => {

        const sendRequest = async (uid:string) => {
            console.log("Inside Menu useEffect");
            try{
                const response = await getStudentBatch(uid);
                console.log({response});
            }catch(err){
                console.log(err);
            }
        }

		// @ts-ignore
		auth().onAuthStateChanged(user => {
			if (!user) {
				setUser(null);
				if (router.routeInfo.pathname !== '/login')
				return router.push('/register');
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

                    // Getting the userbatch
                    // sendRequest(user!.uid);
					}
				} )
		})
        
	}, [router.routeInfo.pathname]);
    
	return <>
		<UserContext.Provider value={user}>
			{/* @ts-ignore */}
			<PracticeDataContext.Provider value={{data:finalData}}>
                <DashboardDataContext.Provider value={{data:finalDashboardData}}>
                    <UserProblemsContext.Provider value={{problemIds:completedProblems}}>
				        {children}
                    </UserProblemsContext.Provider>
                </DashboardDataContext.Provider>
			</PracticeDataContext.Provider>
		</UserContext.Provider>
	</>
}
export default MainContainer;