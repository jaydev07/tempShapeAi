import { useSelector } from "react-redux";
import Lottie from "react-lottie";

import succesAnimation from "../../assets/lottie/succesLottie.json";

const Published = () => {
  const reduxState = useSelector(({ courses }) => ({ courses }));
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: succesAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="d-flex justify-content-center">
      <div className="text-center mt-3">
        <Lottie options={defaultOptions} height={100} width={100} />
        <div className="mb-3" />
        <h1 className="display-3 text-primary">
          {reduxState.courses.newCourse.name}
        </h1>{" "}
        <h3 className="text-default font-weight-800">was Published</h3>
      </div>
    </div>
  );
};

export default Published;
