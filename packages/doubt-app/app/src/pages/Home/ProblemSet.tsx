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

import "./ProblemSet.css";
import {PracticeDataContext} from "../../context/practiceData-context";
import {UserProblemsContext} from "../../context/userProblems-context";
import {UserContext} from "../../context/user-context";
import {getUserProblems} from "../../api/stream";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const ProblemSet = () => {

    const practice = useContext(PracticeDataContext);
    const userProblems = useContext(UserProblemsContext);
    const user = useContext(UserContext);
    const {setId,weekId} = useParams<{ setId: string,weekId: string }>();

    const [isLoading , setIsLoading] = useState(false);
    const [problemSet,setProblemSet] = useState(practice.data[Number(weekId)-1].days[Number(setId)-1]);
    // const [completedProblems,setCompletedProblems] = useState<Array<string>>([]);

    // useEffect(() => {
    //     console.log("Inside");
    //     const sendRequest = async () => {
    //         try{
    //             setIsLoading(true);
    //             const response = await getUserProblems(user!.uid);
    //             setCompletedProblems([...response.data.userFound.problemIds]);
    //         }catch(err){
    //             console.log(err);
    //         }
    //         setIsLoading(false);
    //     }
    //     sendRequest();
    // },[]);

    // console.log(userProblems.problemIds);
    useEffect(() => {
        setProblemSet(practice.data[Number(weekId)-1].days[Number(setId)-1]);
    },[setId,weekId]);

    return(
        <React.Fragment>
            { isLoading && <LoadingSpinner asOverlay />}
            { !isLoading && ( 
                <IonPage>
                    <React.Fragment>
                        <IonHeader>
                            <div className="problem-set-header">
                                <Link to={`/practice/week/${weekId}`}>
                                    <i className="fas fa-arrow-left back-icon"></i>
                                </Link>
                                <h1 className="problem-set-heading">Competative Programming Question Set {setId}</h1>
                            </div>
                        </IonHeader>

                        <IonContent>
                            <div className="questions-container">
                                {
                                    problemSet.problems.map((problem:any,index:number) => {
                                        let completed:number = userProblems.problemIds.findIndex(problemId => problemId===problem._id);
                                        return(
                                            <div className="question-title-container">
                                                <Link to={`/practice/question/${index+1}/set/${setId}/week/${weekId}`} className="question-link">
                                                    <IonRow>
                                                        <IonCol>
                                                            {completed!=-1 ? <i className="fas fa-check-circle icon tick"></i> : <i className="far fa-circle icon unviewed"></i> }
                                                            {/* <i className="far fa-circle icon unviewed"></i> */}
                                                        </IonCol>
                                                        <IonCol size="11.3">
                                                            <h4 className={completed!=-1 ?'complete':'incomplete'}>{index+1}. {problem.statement}</h4>
                                                            {/* <h4 className={'complete'}>{index+1}. {problem.statement}</h4> */}
                                                            <p className="short-discription">{problem.shortDiscription}</p>
                                                        </IonCol>    
                                                    </IonRow>
                                                </Link>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </IonContent>
                    </React.Fragment>
                </IonPage>
            )}
        </React.Fragment>
    )
}

export default ProblemSet;