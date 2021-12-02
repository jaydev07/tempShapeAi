import React,{useState,useEffect,useContext} from 'react';
import {useParams, Link, useHistory} from "react-router-dom";

import {
    IonPage,
    IonContent,
    IonHeader,
    IonGrid,
    IonRow,
    IonCol    
} from "@ionic/react";

import "./QuestionPage.css";
import course from "./PracticeData";
import {PracticeDataContext} from "../../context/practiceData-context";
import {UserContext} from "../../context/user-context";
import {addNewProblemInUser} from "../../api/stream";
import LoadingSpinner from "../../components/shared/LoadingSpinner";

const QuestionPage = () => {

    const history= useHistory();
    const practice = useContext(PracticeDataContext);
    const user = useContext(UserContext);
    const {quesId,setId,weekId} = useParams<{ quesId: string,setId: string,weekId: string }>();

    const [isLoading , setIsLoading] = useState(false);
    // const [practiceCourse, setPracticeCourse] = useState(course);
    const [question,setQuestion] = useState(practice.data[Number(weekId)-1].days[Number(setId)-1].problems[Number(quesId)-1]);

    const showSolutionDiv = () => {
        const solDiv = document.querySelector<HTMLElement>(".solution-container");
        const quesDiv = document.querySelector<HTMLElement>(".statement-container");
        const completedBtn = document.querySelector<HTMLElement>(".completed-btn");
        const problemBtn = document.querySelector<HTMLElement>(".problem");
        const solutionBtn = document.querySelector<HTMLElement>(".solution");
        quesDiv!.style.display = "none";
        solDiv!.style.display="block";
        completedBtn!.style.display = "none";
        solutionBtn!.style.color="#2C5282";
        problemBtn!.style.color="#A0AEC0";
    }

    const showStatementDiv = () => {
        const solDiv = document.querySelector<HTMLElement>(".solution-container");
        const quesDiv = document.querySelector<HTMLElement>(".statement-container");
        const completedBtn = document.querySelector<HTMLElement>(".completed-btn");
        const problemBtn = document.querySelector<HTMLElement>(".problem");
        const solutionBtn = document.querySelector<HTMLElement>(".solution");
        solDiv!.style.display="none";
        quesDiv!.style.display = "block";
        completedBtn!.style.display = "block";
        problemBtn!.style.color="#2C5282";
        solutionBtn!.style.color="#A0AEC0";
    }

    const completeHandler = async (problemId:string) => {
        try{
            setIsLoading(true);
            const response = await addNewProblemInUser(user!.uid, problemId);
        }catch(err){
            console.log(err);
        }
        setIsLoading(false);
        history.push(`/practice/set/${setId}/week/${weekId}`);
    }

    useEffect(() => {
        setQuestion(practice.data[Number(weekId)-1].days[Number(setId)-1].problems[Number(quesId)-1]);
    },[quesId,setId,weekId]);

    return(
        <IonPage>
            { isLoading && <LoadingSpinner asOverlay />}
            <IonHeader>
                <div className="problem-set-header">
                    <p className="root-p-tag">Practice  &gt;  Week{weekId} &gt;  Question Set{setId}  &gt;  Question{quesId}</p>
                    <Link to={`/practice/set/${setId}/week/${weekId}`}>
                        <i className="fas fa-arrow-left back-icon"></i>
                    </Link>
                    <h1 className="problem-set-heading">{question.shortDiscription}</h1>
                </div>
            </IonHeader>

            <IonContent>
                <div className="ques-container">
                    <button className="problem" onClick={showStatementDiv}>
                        Problem
                    </button>
                    <button className="solution" onClick={showSolutionDiv}>
                        <span>Video Solution</span>   <i className="fas fa-lock lock-icon"></i>
                    </button>
                    <br />
                    <hr className="problem-line"/>

                    <div className="statement-container">
                        <p>{question.statement}</p>
                    </div>

                    <div className="solution-container">
                        <iframe width="100%" height="100%" src={question.solutionLink} title="description"></iframe>
                    </div>

                    <button className="attempt-btn">
                        Attempt this Problem 
                    </button>
                    <button className="completed-btn" onClick={() => completeHandler(question._id)}>
                        Mark as Completed
                    </button>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default QuestionPage;