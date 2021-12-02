import { ApolloError } from "apollo-server-errors";
import { Types } from "mongoose";
import CourseTask from "../../../database/models/course-task";
import DocumentTask from "../../../database/models/document-task";
import Module from "../../../database/models/module";
import Quiz from "../../../database/models/quiz/quiz";
import Question from "../../../database/models/quiz/question";

export default async (parent, params) => {
  try {
    const { task } = params;
    let det;
    if (task.type === "DocumentTask")
      det = DocumentTask({
        parent: task._id,
        content: task.details.content,
      });
    if (task.type === "Quiz") {
      det = Quiz({
        parent: task._id,
      });
      if (task.details.questions) {
        task.details.questions.forEach((q) => (q.quiz = det._id));
        const questions = await Question.insertMany(task.details.questions);
        det.questions = questions.map((q) => q._id);
      }
    }
    const courseTask = CourseTask({
      ...task,
      details: det._id,
    });
    const res = await Module.updateOne(
      {
        _id: Types.ObjectId(task.module),
      },
      {
        $push: {
          units: {
            type: "CourseTask",
            unit: courseTask._id,
          },
        },
      }
    );
    if (!res.nModified)
      throw new ApolloError(
        "Module either doesn't exist or not a sub-module",
        "MODULE ID ERROR"
      );
    await det.save();
    await courseTask.save();
    return courseTask;
  } catch (e) {
    throw new ApolloError(e.toString(), "INTERNAL SERVER ERROR");
  }
};
