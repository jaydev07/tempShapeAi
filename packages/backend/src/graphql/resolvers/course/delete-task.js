import { ApolloError } from "apollo-server-errors";
import { Types } from "mongoose";
import CourseTask from "../../../database/models/course-task";
import DocumentTask from "../../../database/models/document-task";
import Module from "../../../database/models/module";
import Quiz from "../../../database/models/quiz/quiz";
import Question from "../../../database/models/quiz/question";

export default async (parent, { id }) => {
  try {
    const task = await CourseTask.findById(id);
    if (task.type === "DocumentTask")
      await DocumentTask.findByIdAndDelete(task.details);
    else if (task.type === "Quiz") {
      await Question.deleteMany({ quiz: task.details });
      await Quiz.findByIdAndDelete(task.details);
    }
    await CourseTask.findByIdAndRemove(id);
    await Module.updateOne(
      {
        _id: Types.ObjectId(task.module),
      },
      {
        $pull: {
          units: {
            unit: task._id,
          },
        },
      }
    );
    return true;
  } catch (e) {
    throw new ApolloError(e.toString(), "INTERNAL SERVER ERROR");
  }
};
