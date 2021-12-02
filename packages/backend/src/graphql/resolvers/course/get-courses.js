import {ApolloError} from "apollo-server-errors";
import Course from "../../../database/models/course";

const COURSES_LIMIT = 5;
export default async (parent, params) => {
  try {
    const { query } = params;
    if (query && Object.entries(query).length > 0) {
      if (query.name) query.name = { $regex: query.name, $options: "i" };
    }

    return await Course.paginate(
      query,
      {
        page: params.page || 1,
        limit: COURSES_LIMIT,
        lean: true,
        populate: "modules",
        customLabels: {
          docs: "courses",
        },
      }
    );
  } catch (e) {
    throw new ApolloError(e.toString(), "INTERNAL SERVER ERROR");
  }
};
