import { ApolloError } from "apollo-server-errors";

export default async (parent, {}, { user }) => {
  try {
    return user;
  } catch (e) {
    throw new ApolloError(e.toString(), "INTERNAL SERVER ERROR");
  }
};
