// Utility function to process and organize modules
export const processModules = (modules) => {
  if (modules.length) {
    const parentModules = modules.filter(({ isSub }) => !isSub);
    const subModules = modules.filter(({ isSub }) => isSub);

    const processedSubModule = [];

    for (let i = 0; i < subModules.length; i++) {
      let level1Child = subModules.filter(
        ({ parentModule }) => parentModule === subModules[i]._id
      );

      for (let j = 0; j < level1Child.length; j++) {
        let level2child = subModules.filter(
          ({ parentModule }) => parentModule === level1Child[j]._id
        );

        if (level2child.length) {
          if (level1Child[j].isProjectModule || level1Child[j].isOptionModule) {
            level2child = level2child.map((data) => ({
              ...data,
              disableProjectModule: true,
            }));
            level1Child[j] = { ...level1Child[j], disableProjectModule: true };
          }
          level1Child[j] = { ...level1Child[j], subs: level2child, level: 2 };
        }
      }

      if (level1Child.length) {
        if (subModules[i].isProjectModule || subModules[i].isOptionModule) {
          level1Child = level1Child.map((data) => ({
            ...data,
            disableProjectModule: true,
          }));
          subModules[i] = { ...subModules[i], disableProjectModule: true };
        }
        subModules[i] = { ...subModules[i], subs: level1Child, level: 1 };
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
