'use strict';
const cron = require('node-cron');
const express = require('express');
const constants = require('./constants');
const config = require('./config');
const app = express();
const port = 3000;
const {validateAchBatch} = require('./services/achService');

try{
  cron.schedule(config.ttlMinutes+' * * * * *', function() {
    console.log('running a task every minute');
    validateAchBatch();
  });

  app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}`);
  });
}
catch(ex){
  console.log(ex);
}