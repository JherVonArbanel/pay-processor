const dataAccess = require('../dataAccess/oracleDataAccess');
const { publish } = require('./kafkaService');
const { PAYMENT_RESPONSE } = require('./../topics');
const {constants} = require('../constants');
const errorConstant = require('../errorConstants')

exports.validateAchBatch = async () => {
  try {

    const achOrdersToUpdate = await dataAccess.getAchOrdersToUpdate();
    const batchAchOrders = achOrdersToUpdate.outBinds.pCURSOR;

    for(const achOrder of batchAchOrders){
      const {ESTADO, NRO_ORDEN, IDENTIFICADOR_OA_PAGO} = achOrder
      // console.log({ESTADO, NRO_ORDEN, IDENTIFICADOR_OA_PAGO})
      let estadoAchOapago;
      let codError;
      if(ESTADO == constants.ACEPTED_ACH){
        estadoAchOapago = constants.ACEPTED_ACH_OAPAGO;
        codError = constants.NO_ERROR_ACH;
      }
      if(ESTADO == constants.REJECTED_ACH){
        estadoAchOapago = constants.REJECTED_ACH_OAPAGO;
        codError = errorConstant.codeErrorACH;
      }
      if(estadoAchOapago){
        console.log('------',{ESTADO, NRO_ORDEN, IDENTIFICADOR_OA_PAGO})
        const response = await dataAccess.updateStateTransaction(IDENTIFICADOR_OA_PAGO, estadoAchOapago, codError);
        const data = response.outBinds.pCURSOR[0];
        const message = responsePayment(data.ID_API_CLIENTE, data);
        console.log(JSON.stringify(message))
        publish(PAYMENT_RESPONSE, JSON.stringify(message));
        break;
      }
    }
    
  }
  catch (error) {
    console.error(error);
  }
};

function responsePayment ( idApiClient, data, errCode='', errMsg='') {
  return {
    'errCode': errCode,
    'errMsg': errMsg,
    'data': {
      'idApiClient': idApiClient,
      'domesticPaymentId': data.IDENTIFICADOR,
      'consentId': data.CONSENTID,
      'status': data.ESTADO,
      'creationDateTime': data.FECHACREACION,
      'statusUpdateDateTime': data.FECHAACTESTADO,
      'cutOffDateTime': data.FECHAEXPIRACION,
      'initiation': {
        'instructionIdentification': data.INSTRUCCION,
        'endToEndIdentification': data.IDENTIFICACIONE2E,
        'localInstrument': data.INSTRUCCION,
        'instructedAmount': {
          'amount': data.IMPORTE,
          'currency': data.MONEDA
        },
        'debtorAccount': {
          'schemeName': data.ESQUEMAORIGEN,
          'identification': data.IDENTIFICADORORIGEN,
          'name': data.NOMBREORIGEN
        },
        'creditorAccount': {
          'schemeName': data.ESQUEMADESTINO,
          'identification': data.IDENTIFICADORDESTINO,
          'secondaryIdentification': data.IDENTIFICADORDESTINOSEC,
          'name': data.NOMBREDESTINO,
          'documentIdentification': data.DOCUMENTIDENTIFICATION
        },
        'supplementaryData': {
          'origin': data.ORIGEN,
          'destination': data.DESTINO,
          'requiresPCC01': data.REQUIEREPCC01===0?false:true
        }      
      }
    },
    'risk': {
      'paymentContextCode': data.CONTEXTOPAGOCODIGO
    },
    'meta': {},
    'links':{
      'self': data.CALLBACKLINK
    }
  };
};