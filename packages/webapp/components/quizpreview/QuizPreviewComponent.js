import React, { useState } from "react";
import { Card, CardBody, CardHeader, Button, Alert } from "reactstrap";
import classnames from "classnames";

import CheckBox from "../FormFields/CheckBox";

const QuizPreviewComponent = ({
  quizList,
  handleMarkAscomplete,
  isCompleted,
  alreadyComplete,
}) => {
  const [selectedCheck, setSelectCheck] = useState([]);
  const [quizError, setQuizError] = useState([]);

  const toggleChecked = (e, quizId) => {
    const targetId = parseInt(e.target.id);
    const doesSelectedCheckExisit = selectedCheck.filter(
      ({ _id }) => _id === quizId
    );

    if (doesSelectedCheckExisit.length) {
      return setSelectCheck(
        selectedCheck.map((checked) => {
          if (checked._id === quizId) {
            if (checked.answers.includes(targetId)) {
              const checkedNew = checked.answers.filter(
                (ans) => ans !== targetId
              );
              return { ...checked, answers: checkedNew };
            }
            return { ...checked, answers: checked.answers.concat(targetId) };
          }
          return checked;
        })
      );
    }

    return setSelectCheck(
      selectedCheck.concat({ _id: quizId, answers: [targetId] })
    );
  };

  const handleQuizSubmit = (e) => {
    if (quizList.length !== selectedCheck.length) {
      return alert("Please answer all the questions");
    }

    const isEqual = (first, second) => {
      for (let i = 0; i < first.length; i++) {
        if (!second.includes(first[i])) {
          return false;
        }
      }
      return true;
    };

    setQuizError([]);
    let hasError = false;

    for (let i = 0; i < selectedCheck.length; i++) {
      quizList.map((quiz) => {
        if (quiz._id == selectedCheck[i]._id) {
          const isAnswersCorrect = isEqual(
            selectedCheck[i].answers,
            quiz.correctAnswers
          );

          if (!isAnswersCorrect) {
            hasError = true;
            return setQuizError(quizError.concat(selectedCheck[i]._id));
          }
        }
      });
    }

    if (!hasError) return handleMarkAscomplete(e);

    return;
  };

  return (
    <>
      {quizList.map((quiz) => (
        <>
          <Card>
            <CardHeader className="h1 font-weight-700">
              {quiz.question}
            </CardHeader>
            <CardBody
              className={classnames({
                "border border-danger": quizError.includes(quiz._id),
              })}
            >
              <Alert color="danger" isOpen={quizError.includes(quiz._id)}>
                Some answers are incorrect
              </Alert>
              {quiz.answers.map(({ answerBody, optionNumber }) => (
                <CheckBox
                  className={
                    quizError.includes(quiz._id) &&
                    classnames({
                      "text-success": quiz.correctAnswers.includes(
                        optionNumber
                      ),
                    })
                  }
                  id={optionNumber}
                  key={optionNumber}
                  checked={
                    selectedCheck.filter(
                      ({ _id, answers }) =>
                        _id === quiz._id && answers.includes(optionNumber)
                    ).length
                  }
                  onChange={(e) => toggleChecked(e, quiz._id)}
                  onFocus={() => setQuizError([])}
                >
                  {answerBody}
                </CheckBox>
              ))}
            </CardBody>
          </Card>
        </>
      ))}
      {!isCompleted && !alreadyComplete && (
        <Button
          className="float-right mb-5"
          color="primary"
          onClick={handleQuizSubmit}
        >
          Submit
        </Button>
      )}
    </>
  );
};

export default QuizPreviewComponent;
