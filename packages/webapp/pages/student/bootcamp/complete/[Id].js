import Lottie from "react-lottie";

// layout for this page
import Admin from "layouts/Admin.js";
import completeLottie from "../../../../assets/lottie/succesLottie.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: completeLottie,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const CourseCompletePage = () => {
  return (
    <>
      <Lottie options={defaultOptions} height={100} width={100} />
      <h1 className="font-weight-800 text-center">Course Completed</h1>
    </>
  );
};

CourseCompletePage.layout = Admin;

export default CourseCompletePage;
