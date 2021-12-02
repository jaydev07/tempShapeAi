import { compact, flatten } from "lodash";

const processTracking = (module, trackingData) => {
  let insertTrackingData = [];
  const { moduleTrackers, currentModule, currentTask } = trackingData;

  for (let i = 0; i < module.length; i++) {
    const temp = moduleTrackers.map(
      (trackData) =>
        trackData.module === module[i]._id && {
          ...module[i],
          isCurrentModule: module[i]._id === currentModule,
          isModuleCompleted:
            module[i].units.length === trackData.unitsCompleted.length,
          units: module[i].units.map(
            (unitData) =>
              unitData.type !== "Module" && {
                ...unitData,
                unit: {
                  ...unitData.unit,
                  isCompleted: trackData.unitsCompleted.includes(
                    unitData.unit._id
                  ),
                  isCurrentTask: unitData.unit._id === currentTask,
                },
              }
          ),
        }
    );

    insertTrackingData.push(compact(temp));
  }

  return flatten(insertTrackingData);
};

// Utility function to process and organize modules
export const processModules = (modules, trackingData) => {
  const trackedModule = trackingData
    ? processTracking(modules, trackingData)
    : modules;

  const parent = trackedModule.filter(({ isSub }) => !isSub);
  const subTemp = trackedModule.filter(({ isSub }) => isSub);

  let moduleTrack = [];
  let sub = [];
  let moduleVisited = [];

  const updateVisited = (module) => {
    console.log({ uv: module.name });
    if (!moduleVisited.includes(module._id)) moduleVisited.push(module._id);
  };

  const trackModule = (modules) => {
    modules.map((module) => {
      if (module._id === trackingData.currentModule) {
        moduleTrack.splice();
        moduleTrack = moduleVisited.concat(module._id);
      }
    });
  };

  const processWorker = (modules) => {
    for (let i = 0; i < modules.length; i++) {
      const childModule = subTemp.filter(
        ({ parentModule }) => parentModule === modules[i]._id
      );
      if (!moduleTrack.length) {
        updateVisited(modules[i]);
      }
      processWorker(childModule);

      modules[i] = { ...modules[i], subs: childModule };
    }
    return modules;
  };

  for (let i = 0; i < subTemp.length; i++) {
    if (!moduleTrack.length) {
      moduleVisited = [];
    }
    const ischild = subTemp.filter(
      ({ parentModule }) => parentModule === subTemp[i]._id
    );
    if (!moduleTrack.length) {
      updateVisited(subTemp[i]);
    }

    const moduleModified = processWorker(ischild);

    if (trackingData) trackModule(subTemp);

    if (moduleTrack.length) {
      const parent = subTemp.filter(({ _id }) => _id === moduleTrack[0]);
      moduleTrack.unshift(parent[0].parentModule);
    }

    subTemp[i] = { ...subTemp[i], subs: moduleModified };

    sub.push(subTemp[i]);
    moduleVisited = [];
  }

  return {
    parent,
    sub,
    moduleTrack,
  };
};
