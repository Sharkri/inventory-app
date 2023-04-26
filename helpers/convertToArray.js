module.exports = function convertToArray(value) {
  // if is undefined
  if (value === undefined) {
    return [];
  }

  // if is not an array
  if (!Array.isArray(value)) {
    return [value];
  }

  // else it is an array, no need to convert
  return value;
};
