exports.constants = {
  SERVICEREDISKEY: "service:",
  ERR8000: "8000",
  MSG8000: "Error de processamiento",
  ERR8001: "8001",
  MSG8001: "Error al consultar base de datos",
  ACEPTED_ACH:'ACEP',
  REJECTED_ACH: 'RECH',
  ACEPTED_ACH_OAPAGO: 'ACCEPTEDSETTLEMENTCOMPLETED',
  REJECTED_ACH_OAPAGO:'REJECTED',
  NO_ERROR_ACH:'ERRACC0000',
};

exports.getErrorBody = (errorCode, errorDescription) => {
  return {
    errCode: errorCode,
    errMsg: errorDescription,
    data: {},
  };
};
