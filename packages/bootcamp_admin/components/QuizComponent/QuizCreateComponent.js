import React from "react";
import { useDispatch } from "react-redux";
import { Card, CardBody, Input, Button, CardFooter, Label } from "reactstrap";

import CheckField from "../FormFields/CheckBox";

import {
  updateQuizAction,
  addNewQuizQuestionAction,
} from "../../redux/reducers/courses/courses.action";

const QuizCreateComponent = ({
  selectedQuiz,
  setSelectedQuiz,
  quizQuestionCollections,
  setQuizQuestionCollections,
  focusModule,
}) => {
  const dispatch = useDispatch();

  const handleQuizInput = (e) => {
    setSelectedQuiz({ ...selectedQuiz, [e.target.name]: e.target.value });
  };
  const handleRightAnswers = (e) => {
    if (selectedQuiz.rightAnswer.includes(parseInt(e.target.name))) {
      return setSelectedQuiz({
        ...selectedQuiz,
        rightAnswer: selectedQuiz.rightAnswer.filter(
          (quiz) => quiz !== parseInt(e.target.name)
        ),
      });
    }
    return setSelectedQuiz({
      ...selectedQuiz,
      rightAnswer: [...selectedQuiz.rightAnswer, parseInt(e.target.name)],
    });
  };

  const saveQuiz = async (e) => {
    const doesQuizExist = quizQuestionCollections.filter(
      (quiz) => quiz._id === e.target.id
    );

    if (doesQuizExist.length) {
      const { payload } = await dispatch(
        updateQuizAction(selectedQuiz._id, selectedQuiz)
      );
      setQuizQuestionCollections(
        quizQuestionCollections.map((quiz) =>
          quiz._id === e.target.id ? payload : quiz
        )
      );
      setSelectedQuiz({
        id: quizQuestionCollections.length + 1,
        question: "",
        1: "",
        2: "",
        3: "",
        4: "",
        rightAnswer: [],
      });
    } else {
      const { payload } = await dispatch(
        addNewQuizQuestionAction(selectedQuiz, focusModule.details._id)
      );
      setSelectedQuiz({
        id: quizQuestionCollections.length + 1,
        question: "",
        1: "",
        2: "",
        3: "",
        4: "",
        rightAnswer: [],
      });
      return setQuizQuestionCollections(
        quizQuestionCollections.concat(payload)
      );
    }
  };

  return (
    <div>
      <Card key={selectedQuiz.id}>
        <CardBody>
          <Label>Question</Label>
          <Input
            type="text"
            placeholder="Question"
            name="question"
            value={selectedQuiz.question}
            onChange={handleQuizInput}
          />
          <hr />
          <CheckField
            name="1"
            onClick={handleRightAnswers}
            checked={selectedQuiz.rightAnswer.includes(1)}
          >
            <Input
              type="text"
              placeholder="Option 1"
              name="1"
              value={selectedQuiz["1"]}
              onChange={handleQuizInput}
            />
          </CheckField>
          <CheckField
            name="2"
            onClick={handleRightAnswers}
            checked={selectedQuiz.rightAnswer.includes(2)}
          >
            <Input
              type="text"
              placeholder="Option 2"
              name="2"
              value={selectedQuiz["2"]}
              onChange={handleQuizInput}
            />
          </CheckField>
          <CheckField
            name="3"
            onClick={handleRightAnswers}
            checked={selectedQuiz.rightAnswer.includes(3)}
          >
            <Input
              type="text"
              placeholder="Option 3"
              name="3"
              value={selectedQuiz["3"]}
              onChange={handleQuizInput}
            />
          </CheckField>
          <CheckField
            name="4"
            onClick={handleRightAnswers}
            checked={selectedQuiz.rightAnswer.includes(4)}
          >
            <Input
              type="text"
              placeholder="Option 4"
              name="4"
              value={selectedQuiz["4"]}
              onChange={handleQuizInput}
            />
          </CheckField>
        </CardBody>
        <CardFooter>
          <Button
            className="float-right"
            outline
            id={selectedQuiz._id}
            onClick={saveQuiz}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizCreateComponent;
