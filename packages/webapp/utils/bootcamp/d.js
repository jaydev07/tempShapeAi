import { compact, flatten } from "lodash";

// const { compact, flatten } = require("lodash");

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

export const processModulesd = (modules, trackingData) => {
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

const fakeModuleObj = [
  {
    _id: "607abf0e219fe726086e5a10",
    name: "History",
    units: [
      {
        type: "Module",
        unit: {
          _id: "607abf3b219fe726086e5a12",
          name: "introduced ",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: null,
          type: null,
          details: null,
          points: null,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
    ],
    isSub: false,
    parentModule: null,
    description:
      'JavaScript was introduced by Brendan Eich in 1995 for Netscape Communications. It was submitted few months later to Ecma International for consideration as an industry standard. The result standard version is ECMAScript.\n\nEven if the name comes from a partnership between Netscape and Sun Microsystems (distributor of Java) JavaScript is not a "light" version of Java.\n\n',
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
  {
    _id: "607abf1b219fe726086e5a11",
    name: "Definition & properties",
    units: [
      {
        type: "Module",
        unit: {
          _id: "607abfd5219fe726086e5a1b",
          name: "Dynamic programming language",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: null,
          type: null,
          details: null,
          points: null,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
    ],
    isSub: false,
    parentModule: null,
    description:
      "JavaScript is a scripting language that supports multiple programming styles. It differs from other languages such as C++, Java or PHP with its dynamic behaviour, its first-class functions and its prototype-based inheritance.\n\nJavaScript lovers consider these features as the force of the language. It's very common for people who try to write JavaScript like they write code in other languages to hate it. Don't make this mistake!\n\n",
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
  {
    _id: "607abf3b219fe726086e5a12",
    name: "introduced ",
    units: [
      {
        type: "CourseTask",
        unit: {
          _id: "607abf46219fe726086e5a14",
          name: "JavaScript ",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: "607abf3b219fe726086e5a12",
          type: "DocumentTask",
          details: "607abf46219fe726086e5a13",
          points: 5,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
      {
        type: "Module",
        unit: {
          _id: "607abf50219fe726086e5a15",
          name: "Communications",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: null,
          type: null,
          details: null,
          points: null,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
    ],
    isSub: true,
    parentModule: "607abf0e219fe726086e5a10",
    description: "",
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
  {
    _id: "607abf50219fe726086e5a15",
    name: "Communications",
    units: [
      {
        type: "Module",
        unit: {
          _id: "607abf58219fe726086e5a16",
          name: "submitted ",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: null,
          type: null,
          details: null,
          points: null,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
      {
        type: "CourseTask",
        unit: {
          _id: "607abf65219fe726086e5a18",
          name: "industry ",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: "607abf50219fe726086e5a15",
          type: "DocumentTask",
          details: "607abf65219fe726086e5a17",
          points: 5,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
    ],
    isSub: true,
    parentModule: "607abf3b219fe726086e5a12",
    description: "",
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
  {
    _id: "607abf58219fe726086e5a16",
    name: "submitted ",
    units: [
      {
        type: "CourseTask",
        unit: {
          _id: "607abf6b219fe726086e5a1a",
          name: "Netscape ",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: "607abf58219fe726086e5a16",
          type: "DocumentTask",
          details: "607abf6b219fe726086e5a19",
          points: 5,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
    ],
    isSub: true,
    parentModule: "607abf50219fe726086e5a15",
    description: "",
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
  {
    _id: "607abfd5219fe726086e5a1b",
    name: "Dynamic programming language",
    units: [
      {
        type: "CourseTask",
        unit: {
          _id: "607abfe0219fe726086e5a1d",
          name: "article",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: "607abfd5219fe726086e5a1b",
          type: "DocumentTask",
          details: "607abfe0219fe726086e5a1c",
          points: 5,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
      {
        type: "Module",
        unit: {
          _id: "607abfef219fe726086e5a1e",
          name: "Eval",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: null,
          type: null,
          details: null,
          points: null,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
      {
        type: "Module",
        unit: null,
        __typename: "UnitTop",
      },
    ],
    isSub: true,
    parentModule: "607abf1b219fe726086e5a11",
    description: "",
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
  {
    _id: "607abfef219fe726086e5a1e",
    name: "Eval",
    units: [
      {
        type: "CourseTask",
        unit: {
          _id: "607abff4219fe726086e5a23",
          name: "Object runtime alteration",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: "607abfef219fe726086e5a1e",
          type: "DocumentTask",
          details: "607abff4219fe726086e5a22",
          points: 0,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
      {
        type: "Module",
        unit: {
          _id: "607ac009219fe726086e5a24",
          name: "Reflection",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: null,
          type: null,
          details: null,
          points: null,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
    ],
    isSub: true,
    parentModule: "607abfd5219fe726086e5a1b",
    description: "",
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
  {
    _id: "607ac009219fe726086e5a24",
    name: "Reflection",
    units: [
      {
        type: "Module",
        unit: {
          _id: "607ac00f219fe726086e5a25",
          name: "Macros",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: null,
          type: null,
          details: null,
          points: null,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
      {
        type: "CourseTask",
        unit: {
          _id: "607ac032219fe726086e5a28",
          name: "Reflective programming",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: "607ac009219fe726086e5a24",
          type: "DocumentTask",
          details: "607ac032219fe726086e5a27",
          points: 5,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
    ],
    isSub: true,
    parentModule: "607abfef219fe726086e5a1e",
    description: "",
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
  {
    _id: "607ac00f219fe726086e5a25",
    name: "Macros",
    units: [
      {
        type: "Module",
        unit: {
          _id: "607ac01a219fe726086e5a26",
          name: "Example code",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: null,
          type: null,
          details: null,
          points: null,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
      {
        type: "CourseTask",
        unit: {
          _id: "607ac05c219fe726086e5a2a",
          name: "limited ",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: "607ac00f219fe726086e5a25",
          type: "DocumentTask",
          details: "607ac05c219fe726086e5a29",
          points: 5,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
    ],
    isSub: true,
    parentModule: "607ac009219fe726086e5a24",
    description: "",
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
  {
    _id: "607ac01a219fe726086e5a26",
    name: "Example code",
    units: [
      {
        type: "CourseTask",
        unit: {
          _id: "607ac06a219fe726086e5a2c",
          name: "Computation of code at runtime and late binding",
          description: "",
          course: "607abee6219fe726086e5a0f",
          module: "607ac01a219fe726086e5a26",
          type: "DocumentTask",
          details: "607ac06a219fe726086e5a2b",
          points: 5,
          __typename: "Unit",
        },
        __typename: "UnitTop",
      },
    ],
    isSub: true,
    parentModule: "607ac00f219fe726086e5a25",
    description: "",
    isProjectModule: false,
    isOptionModule: false,
    resources: [],
    __typename: "ModuleUnitsPopulated",
  },
];

const fakeTrackingObj = {
  course: "607ac07e219fe726086e5a2d",
  courseId: "js101",
  rootCourse: "607abee6219fe726086e5a0f",
  courseVersion: 0,
  user: "607aafa4219fe726086e59f9",
  currentModule: "607abf3b219fe726086e5a12",
  currentTask: "607abf46219fe726086e5a14",
  isCompleted: false,
  completionDate: null,
  moduleTrackers: [
    {
      module: "607abf0e219fe726086e5a10",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
    {
      module: "607abf1b219fe726086e5a11",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
    {
      module: "607abf3b219fe726086e5a12",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
    {
      module: "607abf50219fe726086e5a15",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
    {
      module: "607abf58219fe726086e5a16",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
    {
      module: "607abfd5219fe726086e5a1b",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
    {
      module: "607abfef219fe726086e5a1e",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
    {
      module: "607ac009219fe726086e5a24",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
    {
      module: "607ac00f219fe726086e5a25",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
    {
      module: "607ac01a219fe726086e5a26",
      user: "607aafa4219fe726086e59f9",
      courseTracker: "607ac0a1219fe726086e5a2e",
      unitsCompleted: [],
      percentageCompleted: "0",
      __typename: "ModuleTracker",
    },
  ],
  createdAt: "2021-04-17T11:04:01.100Z",
  __typename: "CourseTracker",
};
