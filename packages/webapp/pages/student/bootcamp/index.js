import React from "react";
import { GET_CURRENT_TRACKER_QUERY } from "../../../gql/bootcamps/getCurrentTracker";
import { useQuery } from "@apollo/client";
import Spinner from "reactstrap/lib/Spinner";
import { useRouter } from "next/router";
// layout for this page
import Layout from "layouts/Admin.js";

const BootcampList = () => {
  const router = useRouter();
  const [showEnrollMessage, set] = React.useState(false);
  const { loading } = useQuery(GET_CURRENT_TRACKER_QUERY, {
    onCompleted: (data) => {
      const { getCurrentTracker } = data;
      if (getCurrentTracker) {
        router.push(`/student/bootcamp/${getCurrentTracker.courseId}`);
      } else set(true);
    },
  });
  return showEnrollMessage ? (
    <h1 className="text-center">Please enroll in a course!</h1>
  ) : (
    <Spinner />
  );
};

BootcampList.layout = Layout;

export default BootcampList;
