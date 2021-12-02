// Utility function to process and organize modules
export const processModules = (modules) => {
  if (modules.length) {
    const parentModules = modules.filter(({ isSub }) => !isSub);
    const subModules = modules.filter(({ isSub }) => isSub);
    const processedSubModule = [];

    const processWorker = (modules) => {
      for (let i = 0; i < modules.length; i++) {
        const childModule = subModules.filter(
          ({ parentModule }) => parentModule === modules[i]._id
        );

        processWorker(childModule);

        if (childModule.length) {
          if (modules[i].isProjectModule || modules[i].isOptionModule) {
            childModule = childModule.map((data) => ({
              ...data,
              disableProjectModule: true,
            }));
            modules[i] = {
              ...modules[i],
              disableProjectModule: true,
            };
          }
        }

        modules[i] = {
          ...modules[i],
          subs: childModule,
        };
      }
      return modules;
    };

    for (let i = 0; i < subModules.length; i++) {
      let ischild = subModules.filter(
        ({ parentModule }) => parentModule === subModules[i]._id
      );

      const processedChild = processWorker(ischild);

      if (ischild.length) {
        if (subModules[i].isProjectModule || subModules[i].isOptionModule) {
          ischild = ischild.map((data) => ({
            ...data,
            disableProjectModule: true,
          }));
          subModules[i] = {
            ...subModules[i],
            disableProjectModule: true,
          };
        }
        subModules[i] = {
          ...subModules[i],
          subs: processedChild,
        };
      }

      processedSubModule.push(subModules[i]);
    }
    return {
      parent: parentModules,
      sub: processedSubModule,
    };
  }

  return {
    parent: [],
    sub: [],
  };
};

// Utility fucntion to perform debouncing
export const debounce = (func, wait) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
