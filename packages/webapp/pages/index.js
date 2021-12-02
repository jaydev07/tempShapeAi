import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Home = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.userToken && localStorage.userToken !== 'null') router.push("/student/");
    router.push('/auth/login');
  }, []);
  return <div />;
};

export default Home;
