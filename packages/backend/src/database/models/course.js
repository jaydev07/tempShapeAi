import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import courseSchemaObj from "./course-schema";

const CourseSchema = new mongoose.Schema(
  courseSchemaObj.schema,
  courseSchemaObj.options
);

CourseSchema.statics.createDraft = async (course) => {
  if (await Course.exists({ Id: course.Id }))
    throw new Error("Course Id provided exists");
  return await Course.create({
    ...course,
    isDraft: true,
  });
};

CourseSchema.statics.publish = async (id) => {
  let draftCourse = await Course.findOne({
    _id: mongoose.Types.ObjectId(id),
    isDraft: true,
  });
  if (!draftCourse) throw new Error("Draft Course not found");
  const currentCourse = await Course.findOne({
    origin: mongoose.Types.ObjectId(id),
    isDraft: false,
  });
  draftCourse = draftCourse.toObject();
  delete draftCourse._id;
  delete draftCourse.__v;
  delete draftCourse.createdAt;
  delete draftCourse.updatedAt;
  await Course.findByIdAndUpdate(id, {
    publishedAt: new Date(),
  });
  if (currentCourse) {
    return Course.findByIdAndUpdate(currentCourse._id, {
      ...draftCourse,
      isDraft: false,
    }, { new: true });
  }
  return await Course.create({
    ...draftCourse,
    isDraft: false,
    origin: mongoose.Types.ObjectId(id),
  });
};
// courseTracker will also have custom courseId as well as objectId to track a specific version of a course
// or will have draft courseId

CourseSchema.index({
  name: 1,
  description: 1,
});

CourseSchema.plugin(mongoosePaginate);

const Course = mongoose.model("Course", CourseSchema);
const CourseRep = mongoose.model(
  "CourseRep",
  new mongoose.Schema(courseSchemaObj.schema, courseSchemaObj.options)
);
export default Course;
