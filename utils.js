exports.parseParameterType = (type) => {
  switch (type) {
    case 2:
      return "integer";
    case 27:
    case 48:
      return "datetime";
    case 28:
    case 34:
      return "double";
    case 50:
      return "time";
    default:
      return "string";
  }
};
