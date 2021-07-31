const kafka = require('kafka-node');
const config = require('../config');
const kafkaHost = { kafkaHost: `${config.kafkaHost}:${config.kafkaPort}` };

exports.publish = function(topic, message){    
  return new Promise((resolve, reject) => {
    try{
      const { Producer } = kafka;
      const client = new kafka.KafkaClient(kafkaHost);
      const producer = new Producer(client);
      const payloads = [
        { topic: topic, messages:message, partition: 0 }
      ];
      producer.on('ready', function () {
        producer.send(payloads, function (err, data) {
          resolve(data);  
        });
      });
         
      producer.on('error', function (err) {
        reject(err);
      });
    }
    catch(err) {
      reject(err);
    }
  });
};

exports.subscribe = function(topic, onError, onMessage){
  try{
    const { Consumer } = kafka;
    const client = new kafka.KafkaClient(kafkaHost);
    const consumer = new Consumer(
      client,
      [
        { topic: topic, partition: 0 }
      ],
      {
        autoCommit: true
      }
    );
        
    consumer.on('error', function(err) {
      if(onError !== undefined){
        onError(err);
      }
    });

    consumer.on('message', message => {
      if(onMessage){
        onMessage(message);
      }
    });
  }
  catch(err) {
    return err;
  }    
};
