const HelperService = {
  compareValues(key, order = "asc") {
    return function innerSort(a, b) {
      const isPropExistInObjA = Object.prototype.hasOwnProperty.call(a, key);
      const isPropExistInObjB = Object.prototype.hasOwnProperty.call(b, key);

      if (!isPropExistInObjA || !isPropExistInObjB) {
        return 0;
      }

      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
      let comparison = 0;

      if (varA > varB) {
        comparison = 1;
      }

      if (varA < varB) {
        comparison = -1;
      }

      return order === "desc" ? comparison * -1 : comparison;
    };
  },
};

export default HelperService;
