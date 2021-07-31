const oracledb = require('oracledb');
const connection = require('./oracleConnection');

exports.getPaymentDTO = async (requestId) => {
  try {
    const object = {
      spName: 'GANADERO.SPR_MID_OBT_PAGO',
      params: {
        pIntRequestId: requestId.toString(),
        pStrStatus: status,
        pStrErroCode: errCode,
        pStrCodError: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
        pStrDesError: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
        pPago: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        pFiltro: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
        pResultado: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      cursorsReturn: [
        'pPago','pFiltro','pResultado'
      ]
    };
    return await connection.runStoreProcedure(object);
  }
  catch (error) {
    console.error(error);
  }
};

exports.getServiceDef = async (requestId) => {
  console.log(requestId);
  try {
    const object = {
      spName: 'GANADERO.SPR_MID_OBT_SERVICE_CONFIG ',
      params: {
        pIntServiceId: requestId,
        pStrCodError: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
        pStrDesError: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
        pServicio: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      },
      cursorsReturn: [
        'pServicio'
      ]
    };
    console.log(object);
    return await connection.runStoreProcedure(object);
  }
  catch (error) {
    console.error(error);
    return null;
  }
};

exports.updateStateTransaction= async(identification,state,codeError='ERRACC0000')=>{
  const requestDto ={
    spName:'GANADERO.PKG_OA_PAGOS.SP_UPDATE_STATE_OA_PAGO',
    params:{
      pIntPagoId:`${identification}`,
      pStrState:state,
      pCodeError: codeError,
      pStrFechaAct: new Date(),
      pStrCodError:{ dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
      pStrDesError:{ dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
      pCURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    },
    cursorsReturn:[
      'pCURSOR'
    ]
  };
  return await connection.runStoreProcedure(requestDto);
};


exports.getAchOrdersToUpdate= async()=>{
  const requestDto ={
    spName:'GANADERO.PKG_OA_PAGOS.SP_GET_ACH_ORDERS_TO_UPDATE',
    params:{
      pStrCodError:{ dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
      pStrDesError:{ dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 200 },
      pCURSOR: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    },
    cursorsReturn:[
      'pCURSOR'
    ]
  };
  return await connection.runStoreProcedure(requestDto);
};