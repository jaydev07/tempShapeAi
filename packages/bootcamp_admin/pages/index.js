import React from "react";
import Link from "next/link";
console.log('testttttttt', process.env.TEST, process.env.NEXT_PUBLIC_GRAPHQL_URL)

const Home = () => {
  return (
    <div className="text-center">
      <h1>Admin Home Page</h1>
      <Link href="/courses/">Courses Lists</Link>
    </div>
  );
};

export default Home;
