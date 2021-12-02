import mongoose from "mongoose";

export default {
  schema: {
    name: {
      type: String,
      required: true,
    },
    Id: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    prerequisites: String,
    type: {
      type: String,
      enum: ["bootcamp"],
      default: "bootcamp",
    },
    tags: [
      {
        type: String,
        index: true,
      },
    ],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "CourseCategory",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    image: {},
    modules: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Module",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    skills: [
      {
        type: String,
        index: true,
      },
    ],
    isDraft: {
      type: Boolean,
      default: false,
    },
    origin: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    publishedAt: Date,
  },
  options: {
    timestamps: true,
  },
};
