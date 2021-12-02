import React from "react";
import { Card, CardBody, CardHeader } from "reactstrap";

import CheckField from "../FormFields/CheckBox";

const QuizPreviewComponent = ({
  quizList,
  Editquiz,
  DeleteQuiz,
  inPreview,
}) => {
  return quizList.map((quiz) => (
    <>
      <Card>
        {!inPreview && (
          <CardHeader className="d-flex justify-content-end">
            <i
              className="fas fa-edit fa-lg text-default mr-2"
              id={quiz._id}
              onClick={Editquiz}
            />
            <i
              className="fas fa-trash-alt fa-lg text-default "
              id={quiz._id}
              onClick={DeleteQuiz}
            />
          </CardHeader>
        )}

        <CardBody>
          <h1>{quiz.question}</h1>
          {quiz.answers.map(({ answerBody, optionNumber }) => (
            <CheckField
              id={optionNumber}
              key={optionNumber}
              checked={quiz.correctAnswers.includes(parseInt(optionNumber))}
            >
              {answerBody}
            </CheckField>
          ))}
        </CardBody>
      </Card>
    </>
  ));
};

export default QuizPreviewComponent;
