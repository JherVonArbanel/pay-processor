const oracledb = require('oracledb');

const dbConfig = require('./dbconfig.js');

exports.runScript = async (sql) => {
  let connection;
  try {
    console.log(sql);
    oracledb.initOracleClient({ configDir: process.env.ORACLE_TSNAME_DIR,libDir: process.env.ORACLE_CLIENT_BIN });
    console.log(dbConfig);
    connection = await oracledb.getConnection(dbConfig);
    console.log(connection);
    return await connection.execute(sql, {}, {
      outFormat: oracledb.OUT_FORMAT_OBJECT
    });
  } 
  catch (err) {
    console.error(err);
  } 
  finally {
    if (connection) {
      try {
        await connection.close();
      }
      catch (err) {
        console.error(err);
      }
    }
  }
};

exports.runStoreProcedure = async (object) => {
  let connection;
  try {
    console.log({runStoreProcedure: object});
    console.log({dbConfig: dbConfig});
    connection = await oracledb.getConnection(dbConfig);
    console.log({connection: connection});
    const paramsName = Object.keys(object.params);
    console.log({paramsName: paramsName});
    const paramsSP = paramsName.map(item => `:${item}`);
    console.log({paramsSP: paramsSP});
    const result = await connection.execute(
      `BEGIN
      ${object.spName}(${paramsSP});
    END;`,
      object.params
    );
    console.log({result: result});
    if (object.cursorsReturn != undefined) {
      for (let i = 0; i < object.cursorsReturn.length; i++) {
        const nameCursor = (object.cursorsReturn[i]);
        let allData = [];
        const consumeStream = new Promise((resolve, reject) => {
          const cursor = result.outBinds[nameCursor];
          const queryStream = cursor.toQueryStream();
          queryStream.on('data', function (row) {
            let data = {};
            for (let i = 0; i <= cursor.metaData.length; i++) {
              if (cursor.metaData[i] != undefined) {
                data[cursor.metaData[i].name] = row[i];
              }
            }
            allData = [...allData, data];
          });
          queryStream.on('error', error => {
            console.log(error);
            reject(error);
          });
          queryStream.on('end', function () {
            queryStream.destroy();
          });
          queryStream.on('close', resolve);
        });
        await consumeStream;
        result.outBinds[nameCursor] = allData;
      }
    }
    return result;
  } 
  catch (err) {
    console.log(err.toString());
  } 
  finally {
    if (connection) {
      try {
        await connection.close();
      }
      catch (err) {
        console.log(err);
      }
    }
  }
};