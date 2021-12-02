import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import UnitComp from "./UnitComp";
import ModuleList from "./ModuleList";

const GenerateModuleLists = ({
  focusModule,
  setFocusModule,
  modulesList,
  setModuleList,
  parentModuleId,
}) => {
  return modulesList.sub.length === 0 ? (
    <SkeletonTheme color="#dadde3">
      <Skeleton count={3} />
    </SkeletonTheme>
  ) : (
    modulesList.sub.map(
      (modules) =>
        modules.parentModule === parentModuleId && (
          <>
            <ModuleList
              key={`${Date.now}`}
              modules={modules}
              focusModule={focusModule}
              setFocusModule={setFocusModule}
              setModuleList={setModuleList}
              modulesList={modulesList}
              parentModuleId={parentModuleId}
            />
          </>
        )
    )
  );
};

export default GenerateModuleLists;
