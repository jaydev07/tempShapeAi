import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import UnitComp from "./UnitComp";
import ModuleList from "./ModuleList";

const GenerateModuleLists = ({
  modulesList,
  focusModule,
  setFocusModule,
  isLoading,
}) => {
  return modulesList.selectedModuleList.length === 0 ? (
    <SkeletonTheme color="#dadde3">
      <Skeleton count={3} />
    </SkeletonTheme>
  ) : (
    modulesList.selectedModuleList.map((modules) => (
      <>
        {modules.units.length &&
          modules.units.map(
            ({ unit, type }) =>
              unit &&
              unit._id &&
              type !== "Module" && (
                <UnitComp
                  moduleId={modules._id}
                  focusModule={focusModule}
                  setFocusModule={setFocusModule}
                  {...unit}
                />
              )
          )}
        {modules.subs &&
          modules.subs.map((subModule) => (
            <ModuleList
              key={modules._id}
              modules={subModule}
              focusModule={focusModule}
              setFocusModule={setFocusModule}
              unitstrack={modulesList.moduleTrack}
            />
          ))}
      </>
    ))
  );
};

export default GenerateModuleLists;
