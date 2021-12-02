import React, { useEffect, useState } from "react";
import { Container, CardBody, Button, Badge, Progress } from "reactstrap";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import classnames from "classnames";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { toast } from "react-toastify";

// Custom hooks
import useUser from "../../../../hooks/useUser";

// Components
import NavBar from "../../../../components/Navbars/AdminNavbar";
import SideBarDropdown from "../../../../components/ModuleComps/SideBarDropdown";
import ResourceComp from "../../../../components/Resources/ResourceComp";
import ResourceNested from "../../../../components/Resources/ResourceNested";
import QuizPreview from "../../../../components/quizpreview/QuizPreviewComponent";
import GenerateModuleLists from "../../../../components/ModuleComps/GenerateModuleLists";

// Utilities
import { processModules } from "../../../../utils/bootcamp";

// Redux Action
import {
  generateModuleCertAction,
  getAllModulesAction,
  getCourseTrackingDataAction,
  commitTaskAction,
  getTaskAction,
  getCurrentTrackingDataAction,
} from "../../../../Redux/reducer/bootcamp/bootcamp.action";
import { updateUserXp } from "../../../../Redux/reducer/user/user.action";

import "../../../../assets/scss/courses/learningPage.module.scss";

const BootcampLearningPage = () => {
  const [courseData, setCourseData] = useState({
    image: { location: "" },
    parentModule: "",
  });
  const [modulesList, setModulesList] = useState({
    parent: [],
    sub: [],
    unModified: [],
    moduleTrack: [],
    selectedModuleList: [],
    moduleProgress: {},
  });
  const [focusModule, setFocusModule] = useState({
    name: "",
    details: { content: "" },
  });
  const [courseTrackingData, setCourseTrackingData] = useState({});
  const [courseComplete, setCourseComplete] = useState(false);
  const [alreadyComplete, setAlreadyCompleted] = useState(false);
  const [showContents, setShowcontents] = useState(true);

  const reduxState = useSelector(({ bootcampReducer }) => ({
    bootcampReducer,
  }));

  const router = useRouter();
  const dispatch = useDispatch();

  // const { isAuthenticated, user, isLoading } = useUser();

  const { moduleId } = router.query;

  useEffect(() => {
    console.log("Learn Page!!");
    const loadData = async () => {
      if (moduleId) {
        if (!reduxState.bootcampReducer.selectedBootcamp) {
          router.push("/student/search/");
        }
        const modules = await dispatch(
          getAllModulesAction(reduxState.bootcampReducer.selectedBootcamp._id)
        );
        const ooo = await dispatch(getCurrentTrackingDataAction());
        console.log({ ooo });

        if (modules) {
          setCourseData({
            ...courseData,
            ...reduxState.bootcampReducer.selectedBootcamp,
            parentModule: modules.payload.filter(
              ({ _id }) => _id === moduleId
            )[0].parentModule,
          });
          const tracker = await dispatch(
            getCourseTrackingDataAction(
              reduxState.bootcampReducer.selectedBootcamp._id
            )
          );
          if (tracker.payload.isCompleted) setAlreadyCompleted(true);

          const processedModules = processModules(
            modules.payload,
            tracker.payload
          );

          setModulesList({
            ...modulesList,
            ...processedModules,
            selectedModuleList: processedModules.sub.filter(
              ({ _id }) => _id === moduleId
            ),
            unModified: modules.payload,
            moduleProgress: tracker.payload.moduleTrackers.filter(
              ({ module }) => module === moduleId
            )[0],
          });
        }
      }
    };
    loadData();
  }, [moduleId]);

  const handleMarkAscomplete = async (e) => {
    e.preventDefault();

    const { payload } = await dispatch(commitTaskAction(focusModule._id));
    dispatch(updateUserXp(focusModule.points));

    if (payload) {
      const processedModules = processModules(modulesList.unModified, payload);

      // Check if the certified module is completed to generate certificate
      modulesList.unModified.map(async ({ isCertificateAvailable, _id }) => {
        if (isCertificateAvailable && _id === moduleId) {
          payload.moduleTrackers.map(
            async ({ module, percentageCompleted }) => {
              if (module === _id && parseInt(percentageCompleted) > 99) {
                await dispatch(generateModuleCertAction(module));
              }
            }
          );
        }
      });
      if (payload.currentModule && payload.currentModule !== moduleId) {
        router.push(`/student/bootcamp/learns/${payload.currentModule}`);
      }
      setModulesList({
        ...modulesList,
        ...processedModules,
        selectedModuleList: processedModules.sub.filter(
          ({ _id }) => _id === moduleId
        ),
        moduleProgress: payload.moduleTrackers.filter(
          ({ module }) => module === moduleId
        )[0],
      });
      modulesList.unModified.map(
        (module) =>
          module._id === payload.currentModule &&
          module.units.map(async ({ unit }) => {
            if (unit && unit._id === payload.currentTask) {
              const { payload } = await dispatch(getTaskAction(unit._id));
              setFocusModule({
                ...payload,
                isCompleted: false,
                isCurrentTask: true,
              });
            }
          })
      );
    }
    if (payload.isCompleted && !alreadyComplete) {
      router.push(`/student/bootcamp/complete/${courseData.Id}`);
    }
  };

  const redirect = (e, link) => router.push(link);

  return (
    <>
      <NavBar
        learnPage
        showcontent={showContents}
        showSidebar={() => setShowcontents(!showContents)}
        handleNext={handleMarkAscomplete}
        isQuiz={focusModule.details && focusModule.details.questions}
        alreadyComplete={
          (modulesList.selectedModuleList.length &&
            modulesList.selectedModuleList[0].isModuleCompleted) ||
          alreadyComplete
        }
      />
      <div
        className={classnames(
          { "learning__page__sidebar shadow-2lg": showContents },
          {
            learning__page__sidebar__close: !showContents,
          }
        )}
      >
        <CardBody>
          <div className="mt-2 d-flex justify-content-around">
            <Button
              outline
              className="btn-icon btn-3"
              color="primary"
              type="button"
              name="dashboard"
              onClick={(e) => redirect(e, "/student/")}
            >
              <span className="btn-inner--text">Dashboard</span>
              <span className="btn-inner--icon">
                <i className="fas fa-arrow-left"></i>
              </span>
            </Button>
            <Button
              outline
              className="btn-icon btn-3"
              color="primary"
              type="button"
              onClick={(e) =>
                redirect(
                  e,
                  `/student/bootcamp/modules/${courseData.parentModule}`
                )
              }
            >
              <span className="btn-inner--text">Module Lists</span>
              <span className="btn-inner--icon">
                <i className="fas fa-arrow-left"></i>
              </span>
            </Button>
          </div>
          <div className="mt-3 mb-4 mx-3">
            <div className=" progress-wrapper">
              <div className=" progress-info">
                <div className=" progress-percentage">
                  <Badge className="text-capitalize text-primary text-xs">
                    {parseInt(modulesList.moduleProgress.percentageCompleted) >
                    100
                      ? "100"
                      : Math.round(
                          modulesList.moduleProgress.percentageCompleted
                        )}
                    % Completed
                  </Badge>
                </div>
              </div>
              <Progress
                max="100"
                value={modulesList.moduleProgress.percentageCompleted}
                color="primary"
              ></Progress>
            </div>
          </div>
          <SideBarDropdown name="Resources">
            {modulesList.selectedModuleList.map((modules) => (
              <>
                {modules.resources.length
                  ? modules.resources.map((resource) => (
                      <ResourceComp key={resource._id} {...resource} />
                    ))
                  : "No Resources Available"}
                {modules.subs &&
                  modules.subs.map((subModule) => (
                    <ResourceNested key={modules._id} modules={subModule} />
                  ))}
              </>
            ))}
          </SideBarDropdown>
          <SideBarDropdown name="Contents" defaultOpen>
            <GenerateModuleLists
              modulesList={modulesList}
              focusModule={focusModule}
              setFocusModule={setFocusModule}
              isLoading={reduxState.bootcampReducer.loading}
            />
          </SideBarDropdown>
        </CardBody>
      </div>

      <div className={classnames({ move__main__content: showContents })}>
        <Container className="mt-3">
          <SkeletonTheme color="#dadde3">
            <h1 className="display-2 font-weight-700">
              {reduxState.bootcampReducer.loading ? (
                <Skeleton width={300} />
              ) : (
                focusModule.name
              )}
            </h1>
            <div className="markdown-content">
              {reduxState.bootcampReducer.loading ? (
                <>
                  <Skeleton height={10} />
                  <Skeleton height={10} />
                  <Skeleton height={10} width={700} />
                  <Skeleton height={10} width={550} />
                </>
              ) : (
                <>
                  {focusModule.details && focusModule.details.content && (
                    <MarkdownPreview source={focusModule.details.content} />
                  )}
                  {focusModule.details && focusModule.details.questions && (
                    <QuizPreview
                      quizList={focusModule.details.questions}
                      handleMarkAscomplete={handleMarkAscomplete}
                      {...focusModule}
                      alreadyComplete={alreadyComplete}
                    />
                  )}
                </>
              )}
            </div>
          </SkeletonTheme>
        </Container>
      </div>
    </>
  );
};
async function getServerSideProps(context) {
  return {
    props: context.params, // will be passed to the page component as props
  };
}
export default BootcampLearningPage;
